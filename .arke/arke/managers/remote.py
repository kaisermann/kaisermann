import sys
import zipfile
from os.path import isdir, join
from time import strftime

import pathspec
from fabric.api import *
from fabric.colors import *
from fabric.contrib.files import upload_template as orig_upload_template
from fabric.contrib.files import contains, exists, is_link, sed
from fabric.contrib.project import upload_project

import arke as arke
from arke.helpers import *
from arke.managers.boilerplate import ManagerBoilerplate


class RemoteManager(ManagerBoilerplate):

  def setup(self):
    isInstalled = self.checkRequisites()
    sitesAvailable = ''
    sitesEnabled = ''

    if(isInstalled.has_key('nginx') and isInstalled['nginx']):
      installationMode = 'manual'

      sitesAvailable = join(arke.Core.paths['nginx'], 'sites-available',
                            arke.Core.getEnvOption('name'))
      sitesEnabled = join(
          arke.Core.paths['nginx'], 'sites-enabled', arke.Core.getEnvOption('name'))

      # nginx setup
      if(isInstalled.has_key('ee') and isInstalled['ee'] and ask('Create website with EasyEngine?')):
        installationMode = 'ee'
        eeFlags = [
          '--html',
          '--php --php7',
          '--mysql --php7',
          '--wp --php7',
          '--wpfc --php7'
        ]

        print yellow('\n>> Creating site with EasyEngine')
        siteFlags = eeFlags[whichOption(['HTML', 'PHP', 'PHP \ MySQL',
                                          'Wordpress', 'Wordpress + FastCGI Cache'],
                                         'Choose a website type',
                                         'Type: ')]

        with hide('warnings'), settings(warn_only=True):
          sudo('ee site create %s %s' %
               (siteFlags, arke.Core.getEnvOption('name')))

        with hideOutput():
          # Appends /current to the server block root path
          sed(sitesAvailable, 'root .*;', 'root %s;' % arke.Core.paths['webRoot'],
              limit='', use_sudo=True, backup='', flags='i', shell='/bin/bash')

          # Deletes default files
          if(len(arke.Core.paths['publicHTML']) > 0 and arke.Core.paths['publicHTML'] != '/'):
            sudo('rm -rf %s/*' % arke.Core.paths['publicHTML'])

        print green('>> Done creating site with EasyEngine')

      elif ask('Run nginx configuration setup instead?'):
        print yellow('\n>> Creating site with arke\'s nginx template')
        with hideOutput():
          print cyan('>>> Uploading nginx.conf -> shared/nginx.conf')
          put('%s/templates/nginx/nginx.conf' % arke.Core.paths['auxFiles'],
              join(arke.Core.paths['shared'], 'nginx.conf'), use_sudo=True)

          print cyan('>>> Uploading nginx server block -> etc/sites-available/%s' % arke.Core.getEnvOption('name'))
          self.upload_template('site',
                               sitesAvailable,
                               template_dir='%s/templates/nginx' % arke.Core.paths['auxFiles'],
                               use_sudo=True,
                               use_jinja=True,
                               context={
                                   'HOSTNAME': arke.Core.getEnvOption('hostnames'),
                                   'ROOT': arke.Core.paths['webRoot'],
                               })

          print cyan('>>> Linking sites-available -> sites-enabled')
          if is_link(sitesEnabled):
            sudo('unlink %s' % sitesEnabled)
          elif exists(sitesEnabled):
            sudo('rm -rf %s' % sitesEnabled)
          sudo('ln -sfv %s %s' % (sitesAvailable, sitesEnabled))

          self.service_reload('nginx')
        print green('>> Done creating site with arke\'s nginx template')

    # Creates shared/release directory structure
    print yellow('\n>> Creating shared and releases directories')
    with hideOutput():
      sudo('mkdir -p %s %s' % (arke.Core.paths['releases'],
                               join(arke.Core.paths['shared'], 'uploads')))
      sudo('touch %s/robots.txt' % arke.Core.paths['shared'])
    print green('>> Done creating shared and releases directories')

    if(installationMode == 'ee'):
      defaultWPConfig = '%s/wp-config.php' % arke.Core.paths['project']
      if(exists(defaultWPConfig)):
        print yellow('\n>> Moving EasyEngine\'s default wp-config.php to shared folder')
        with hideOutput():
          sudo('mv %s %s/' % (defaultWPConfig, arke.Core.paths['shared']))
        print green('>> Done moving default wp-config.php')

      print ''
      if(ask('Link htdocs/.well-known to shared/.well-known?')):
        print yellow('\n>> Linking .well-known directory')
        with hideOutput():
          sudo('ln -sfv %s/.well-known %s/.well-known' %
               (arke.Core.paths['publicHTML'], arke.Core.paths['shared']))
        print green('>> Done linking .well-known')

    # .env
    print ''
    if ask('Upload .env?'):
      print yellow('\n>> Uploading .env')
      with cd(arke.Core.paths['shared']), hideOutput():
        self.upload_template('dotenv',
                             '.env',
                             template_dir='%s/templates/wp/' % arke.Core.paths['auxFiles'],
                             use_sudo=True,
                             use_jinja=True,
                             context={
                                 'ENVIRONMENT': env.name,
                                 'MAIN_URL': arke.Core.getEnvOption('name')
                             })

        print cyan('>>> Generating salts on the .env file')
        with hideOutput(), settings(warn_only=True):
          run('wp dotenv salts regenerate')
        print green('>> Done uploading .env')

    elif ask('Upload wp-config.php?'):
      print yellow('\n>> Uploading wp-config.php')
      with cd(arke.Core.paths['shared']), hideOutput():
        self.upload_template('wp-config.php',
                             'wp-config.php',
                             template_dir='%s/templates/wp/' % arke.Core.paths['auxFiles'],
                             use_sudo=True,
                             use_jinja=True,
                             context={
                                 'ENVIRONMENT': env.name
                             })
      print green('>> Done uploading wp-config.php')

    self.fixPermissions()

  def checkRequisites(self):
    isInstalled={}
    with hide('warnings', 'output'), settings(warn_only=True):
      # Check for nginx
      with hide('running'):
        isInstalled['nginx']=run('which nginx').return_code == 0

      # Check for Composer
      with hide('running'):
        result=run('which composer')

      isInstalled['composer']=result.return_code == 0

      print yellow('\n>> Checking for Composer')
      if not isInstalled['composer']:
        print yellow('\n>> Installing Composer')
        with cd('/tmp/'):
          run('curl https://getcomposer.org/installer -o /tmp/composer-setup.php')
          run('php /tmp/composer-setup.php')
          sudo('mv /tmp/composer.phar /usr/local/bin/composer')
          print green('>> Composer installed')
      else:
        print green('>> Composer already installed')

      # Check for WP-CLI
      print yellow('\n>> Checking for WP-CLI')
      with hide('running'):
        result=run('which wp')

      isInstalled['wp']=result.return_code == 0

      if not isInstalled['wp']:
        print yellow('\n>> Installing WP-CLI')
        run('curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /tmp/wp-cli.phar')
        run('chmod +x /tmp/wp-cli.phar')
        sudo('mv /tmp/wp-cli.phar /usr/local/bin/wp')
        run('wp package install aaemnnosttv/wp-cli-dotenv-command')
        run('wp package install sebastiaandegeus/wp-cli-salts-command')
        print green('>> WP-CLI installed')
      else:
        print green('>> WP-CLI already installed')

      # Check for easyengine
      print yellow('\n>> Checking for EasyEngine')
      with hide('running'):
        result=run('which ee')

      isInstalled['ee']=result.return_code == 0

      if not isInstalled['ee'] and ask('Should install EasyEngine? '):
        print yellow('\n>> Installing EasyEngine')
        sudo('wget -qO ee rt.cx/ee && sudo bash ee')
        print green('>> EasyEngine installed')
      else:
        print green('>> EasyEngine already installed')
    print ''
    return isInstalled

  def deploy(self, deployMode='bundle', optBranch='master'):
    baseDir=arke.Core.paths['base']
    if ask('You want to continue with deploy to "%s"?' % env.name):

      print yellow('\n>> Beginning deployment')

      if 'beforeDeploy' in arke.Core.options['project']['cmds']:
        print yellow('\n>> Running before-deploy commands')
        with hide('running'):
          runCommandList(arke.Core.options['project']['cmds']['beforeDeploy'],
                         arke.Core.paths['base'],
                         True,
                         True)
        print green('>> Done running before-deploy commands')

      if(deployMode == 'git'):
        release_name='%s' % strftime('%Y-%m-%d_%H-%M-%S')
        print yellow('\n>> Creating new release')
        with hideOutput():
          lbash('git pull origin %s' % optBranch)
          lbash('git tag -a "%s" -m "%s"' % (release_name, env.name))
          lbash('git push --tags')
        print green('>> Done creating new release')
        self.cloneRelease(release_name)
        self.createSymbolicLinks(release_name, deployMode)
        self.afterDeploy(release_name)
      else:
        if(isdir(join(baseDir, '.git'))):
          print yellow('\n>> Pulling latest changes from repository')
          with hide('running'):
            lbash('git pull origin master')
          print green('>> Done pulling latest changes from repository')

        release_name='%s.deploy' % (strftime('%Y-%m-%d_%H-%M-%S'))
        createBundle(release_name, baseDir, False)

        self.uploadBundle(release_name)
        self.createSymbolicLinks(release_name, deployMode)
        self.afterDeploy(release_name)
    print green('>> Done deploying')

  def cloneRelease(self, release_name):
    curReleaseDir=join(arke.Core.paths['releases'], release_name)
    print yellow('\n>> Cloning newest release on remote server')
    with hide('running'):
      sudo('git clone --branch "%s" %s "%s"' %
          (release_name, arke.Core.options['project']['repo'], curReleaseDir))
    print green('>> Done cloning newest release')

  def uploadBundle(self, release_name):
    releaseZip='%s.zip' % release_name

    print yellow('\n>> Uploading newest release to remote server')
    with hideOutput():
      upload_project(
          local_dir=join(arke.Core.paths['base'], releaseZip),
          remote_dir=arke.Core.paths['releases'], use_sudo=True
      )
      with cd(arke.Core.paths['releases']):
        sudo('unzip %s -d ./%s; rm -rf %s' %
             (releaseZip, release_name, releaseZip))
      lbash('rm -f "%s.zip"' % releaseZip)
    print green('>> Done uploading newest release')

  def createSymbolicLinks(self, release_name, deployMode):
    curReleaseDir=join(arke.Core.paths['releases'], release_name)
    print yellow('\n>> Creating links between shared files')
    for arr in arke.Core.options['project']['fileStructure']['shared']:

      if len(arr) == 1:
        arr=[arr[0], arr[0]]

      nodeOriginFullPath=join(curReleaseDir, arr[0])
      nodeTargetFullPath=join(arke.Core.paths['shared'], arr[1])

      print cyan('>>> Linking: current/%s -> shared/%s' % tuple(arr))
      with hideOutput():
        if is_link(nodeOriginFullPath):
          sudo('unlink %s' % (nodeOriginFullPath))
        elif exists(nodeOriginFullPath):
          sudo('rm -rf %s' % (nodeOriginFullPath))
        sudo('ln -sfv %s %s' % (nodeTargetFullPath, nodeOriginFullPath))
    print green('>> Done linking shared files and folders')

    if deployMode != 'bundle' and 'toUpload' in arke.Core.options['project']['fileStructure']:
      print yellow('\n>> Sending all files/folders listed on "toUpload"')
      for arr in arke.Core.options['project']['fileStructure']['toUpload']:

        if len(arr) == 1:
          arr=[arr[0], arr[0]]

        nodeOriginFullPath=join(arke.Core.paths['base'], arr[0])
        nodeTargetFullPath=join(curReleaseDir, arr[1])

        print cyan('>>> Uploading: %s -> %s' % tuple(arr))
        with hideOutput():
          upload_project(local_dir=nodeOriginFullPath,
                         remote_dir=nodeTargetFullPath, use_sudo=True)
      print green('>> Done uploading files and folders')
    self.fixPermissions()

  def afterDeploy(self, release_name):
    curReleaseDir=join(arke.Core.paths['releases'], release_name)

    with hideOutput(), settings(warn_only=True):
      print yellow('\n>> Restarting services')
      for service in arke.Core.getEnvOption('services')['toRestart']:
        self.service_restart(service)
      print green('>> Done restarting services')

      print yellow('\n>> Reloading services')
      for service in arke.Core.getEnvOption('services')['toReload']:
        self.service_reload(service)
      print green('>> Done reloading services')

    if 'afterDeploy' in arke.Core.options['project']['cmds']:
      print yellow('\n>> Running after-deploy commands')
      with hide('running'):
        runCommandList(arke.Core.options['project']['cmds']['afterDeploy'],
                       curReleaseDir,
                       False)
      print green('>> Done running after-deploy commands')

    # Links latest release to the current directory
    print yellow('\n>> Linking "current" directory to newest release')

    with hideOutput():
      if is_link(arke.Core.paths['current']):
        sudo('unlink %s' % (arke.Core.paths['current']))
      elif exists(arke.Core.paths['current']):
        sudo('rm -rf %s' % (arke.Core.paths['current']))

      sudo('ln -sfv %s %s' % (curReleaseDir, arke.Core.paths['current']))
      print green('>> Done linking "current" directory')

    self.fixPermissions()

    self.cleanup_releases(arke.Core.options['project']['maxReleases'])

  def fixPermissions(self, folderPath=0):
    if(folderPath == 0):
      folderPath=arke.Core.paths['project']

    print yellow('\n>> Fixing project\'s permissions at \'%s\'' % folderPath)
    with hide('everything'):
      sudo('chown -RfHh %s:%s %s' %
           (arke.Core.getEnvOption('webServerUser'), arke.Core.getEnvOption('webServerGroup'), folderPath))
      with cd(folderPath):
        sudo('find . -type d -print0 | xargs -0 chmod 0775')
        sudo('find . -type f -print0 | xargs -0 chmod 0664')
    print green('>> Done fixing permissions')

  def cleanup_releases(self, keep):
    print yellow('\n>> Removing old releases...')
    with hide('everything'):
      releases=self.list_releases()
      releases.sort(reverse=True)

      for release in releases[int(keep):]:
        release=release.strip()
        sudo('rm -rf %s/%s' % (arke.Core.paths['releases'], release))
    print green('>> Done removing old releases')

  def list_releases(self):
    with cd(arke.Core.paths['releases']):
      return run('ls -1 | sort').split('\n')

  def service_restart(self, name):
    print cyan('>>> Restarting %s' % name)
    sudo('service %s restart' % name)

  def service_reload(self, name):
    print cyan('>>> Reloading %s' % name)
    sudo('service %s reload' % name)

  def upload_template(self, src, dest, *args, **kwargs):
    orig_upload_template(src, dest, *args, **kwargs)
    sudo('chmod +r %s' % dest)
