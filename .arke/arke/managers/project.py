from __future__ import absolute_import, unicode_literals, with_statement

import os
import random
import shutil
import tempfile
import time
from os.path import join as j
from os.path import isdir, isfile, relpath
from time import strftime

from fabric.api import *
from fabric.colors import *

import arke
from arke.helpers import *
from arke.managers.boilerplate import ManagerBoilerplate

projectTypes = ['HTML', 'PHP', 'Simple WordPress', 'Bedrock WordPress']
projectTypeValues = ['html', 'php', 'simple-wordpress', 'bedrock-wordpress']


class ProjectManager(ManagerBoilerplate):

  def setup(self):
    if not ask('Setup a new project at "%s"?' % arke.Core.paths['base']):
      exit(0)

    projectType = projectTypeValues[
        whichOption(projectTypes,
                    'Which kind of project it is?',
                    'Project Type: '
                    )
    ]

    targetDir = arke.Core.paths['base']

    with hide('running'):
      with lcd(targetDir):
        if(projectType == 'html' or projectType == 'php'):  # HTML OR PHP
          print yellow('\n>> Downloading hyperion')
          lbash(
              'git clone --depth=1 --branch=master git@github.com:kaisermann/hyperion.git hyperion;')
          lbash(
              'rm -rf hyperion/{.git,.gitignore,readme.md}; mv hyperion/* .; rm -rf hyperion;', True)
          print green('>> Done downloading hyperion')

          print yellow('\n>> Creating basic file structure')
          if(projectType == 'php'):
            lbash('touch index.php')
            lbash('mkdir -p src views/partials')
          else:
            lbash('touch index.html')
          print green('>> Done creating basic file structure')

        elif(projectType == 'simple-wordpress'):  # WordPress
          print yellow('\n>> Downloading WordPress')
          lbash(
              'curl --silent https://wordpress.org/latest.tar.gz | tar xz; mv wordpress/* .;', True)
          lbash('rm -rf license.txt readme.html wp-config*.php wordpress/;')
          print green('>> Done downloading WordPress')

          print yellow('\n>> Downloading selene')
          lbash(
              'git clone --depth=1 --branch=master git@github.com:kaisermann/selene.git selene;')
          lbash('rm -rf selene/.git; mv selene wp-content/themes/;', True)
          print green('>> Done downloading selene')

        elif(projectType == 'bedrock-wordpress'):  # Bedrock
          print yellow('\n>> Downloading Bedrock')
          lbash(
              'git clone --depth=1 --branch=master git@github.com:roots/bedrock.git bedrock;')
          print green('>> Done downloading Bedrock')

          print yellow('\n>> Downloading selene')
          lbash(
              'git clone --depth=1 --branch=master git@github.com:kaisermann/selene.git selene;')
          print green('>> Done downloading selene')

          print yellow('\n>> Arranging project files')
          lbash(
              'rm -rf bedrock/{.git,.gitignore,.github,*.md}; mv bedrock/* ./; rm -rf bedrock;', True)
          lbash('rm -rf selene/.git; mv selene web/app/themes/;', True)
          print green('>> Done arranging project files')

      print yellow('\n>> Updating arke.json and .deploy')
      overwriteJson = True
      jsonFileExists = isfile(j(arke.Core.paths['base'], 'arke.json'))

      if(jsonFileExists):
        overwriteJson = ask(
            '"arke.json" already exists. Overwrite it with the respective project type template?')

      with lcd(arke.Core.paths['base']):
        if(overwriteJson):
          if(jsonFileExists and ask('Backup the current "arke.json"?')):
            lbash('cp arke.json arke.json.bk')
          lbash('cp -f %s/templates/arke/%s.json arke.json' %
                (arke.Core.paths['auxFiles'], projectType))
          arke.Core.loadOptions()

        lbash('cp -f %s/templates/arke/%s.deploy .deploy' %
              (arke.Core.paths['auxFiles'], projectType))
        arke.Core.loadOptions()

      arke.Core.options['project']['type'] = projectType
      arke.Core.saveOptions()
      print green('>> Done updating arke.json and .deploy')

      print ''
      ask('%s\nShould configure the project git repository?' % red(
          'Do not do this with an already commited project. The ".git" folder will be DELETED.')) and self.git('setup')

      self.install()

  def install(self):
    print yellow('\n>> Executing project installation process')
    projectType = arke.Core.options['project']['type']

    if projectType == 'bedrock-wordpress' or projectType == 'simple-wordpress':
      with lcd(arke.Core.paths['base']), hide('running', 'output'):
        confFileName = 'wp-config.php'
        if(projectType == 'bedrock-wordpress'):
          confFileName = '.env'

        if not isfile(j(arke.Core.paths['base'], confFileName)) and ask('Configure %s?' % confFileName):
          self.wp('configure', confFileName)
          print yellow('\n>> If you need to insert anything in your config file before the installation process,\nplease do it now.')
          print 'Press any key when finished'
          raw_input()

    runCommandList(arke.Core.options['project']['cmds']['install'],
                   arke.Core.paths['base'],
                   True,
                   True)

    print green('>> Done executing project installation process')

  def wp(self, subtask='', confFileName=None):

    if(subtask == ''):
      print red('Missing subtask')
      exit(1)

    print yellow('\n>> Executing git "%s" subtask' % subtask)

    if(subtask == 'configure'):

      fileToTemplateDict = {
          'wp-config.php': 'wp-config.php',
          '.env': 'dotenv'
      }

      print yellow('\n>> Configuring "%s"' % confFileName)
      fields = [
          'DB_NAME',
          'DB_USER',
          'DB_PASSWORD',
          'DB_HOST',
          'WP_PREFIX',
          'WP_HOME',
          'ENVIRONMENT'
      ]

      if not confFileName:
        fileNames = ['wp-config.php', '.env']
        confFileName = fileNames[
            whichOption(fileNames,
                        'Which kind of configuration file?',
                        'Configuration filetype: '
                        )
        ]

      templateName = fileToTemplateDict[confFileName]

      with lcd(arke.Core.paths['base']), hide('running'):
        if isfile(j(arke.Core.paths['base'], confFileName)) and ask('Backup old configuration file?'):
          lbash('mv %s %s.bak' % (confFileName, confFileName))

        lbash('cp -rf %s/templates/wp/%s %s' %
              (arke.Core.paths['auxFiles'], templateName, confFileName))

        for field in fields:
          if(field == 'ENVIRONMENT'):
            fieldVal = 'development'
          else:
            fieldVal = raw_input('Insert field %s: ' % field)

            if(field == 'WP_PREFIX'):
              fieldVal = fieldVal or 'wp_'

          lbash("sed -i '' -e 's|{{ %s }}|%s|' %s" %
                (field, fieldVal, confFileName))

      if(confFileName == '.env'):
        with hide('everything'), settings(warn_only=True):
          ret = lbash('wp dotenv salts regenerate')
          if(ret.return_code == 0):
            print cyan('>>> Generating salts')
      print green('>> Done configuring "%s"' % confFileName)
    else:
      print red('Invalid subtask')
      exit(1)

    print green('>> Done executing git "%s" subtask' % subtask)

  def git(self, subtask=''):
    returnValue = None

    if(subtask == ''):
      print red('Missing subtask')
      exit(1)

    print yellow('\n>> Executing git "%s" subtask' % subtask)
    if(subtask == 'setup'):
      repoUrl = arke.Core.options['project']['repo']

      if not ask('Use the url from "arke.json" (%s)?' % repoUrl):
        repoUrl = raw_input('\nType the repository origin url: ')
        print cyan('\n>>> Updating repository origin url on arke.json')
        arke.Core.options['project']['repo'] = repoUrl
        arke.Core.saveOptions()

      with lcd(arke.Core.paths['base']), hideOutput():
        print cyan('>>> Deleting old .git folder')
        lbash('rm -rf .git/')
        print cyan('>>> Initializing new git with origin as "%s"' % repoUrl)
        lbash('git init; git remote add origin %s' % repoUrl)
    else:
      print red('Invalid subtask')
      exit(1)

    print green('>> Done executing git "%s" subtask' % subtask)
    return returnValue

  def bundle(self, debug = ''):
    release_name = '%s.deploy' % (strftime('%Y-%m-%d_%H-%M-%S'))
    createBundle(release_name, arke.Core.paths['base'], debug == 'debug')

  def reset(self):
    if ask('Should delete everything but "arke" files?'):
      print '\nType "0" to cancel\n'
      randomSum = -1
      randomNumber1 = randomNumber2 = 0
      while randomSum != (randomNumber1 + randomNumber2) and randomSum != 0:
        randomNumber1 = random.randint(1, 9)
        randomNumber2 = random.randint(1, 9)
        try:
          randomSum = int(raw_input('How much is %d + %d = ' % (randomNumber1, randomNumber2)))
        except:
          randomSum = -1

      if(randomSum == 0):
        exit(0)

      files = [
          '.arke',
          'arke.json',
          '.deploy',
          'fabfile.py',
          '.git',
          '.gitignore',
          '.editorconfig',
          'readme.md'
      ]
      print yellow('\n>> Deleting non-arke files and folders')
      with lcd(arke.Core.paths['base']), hide('everything'), settings(warn_only=True):
        tmpDir = tempfile.mkdtemp()
        for f in files:
          lbash('cp -rf %s %s/' % (f, tmpDir))
        lbash('ls -A1 | xargs rm -rf')
        for f in files:
          lbash('cp -rf %s/%s ./' % (tmpDir, f))
        shutil.rmtree(tmpDir)
      print green('>> Done resetting')
