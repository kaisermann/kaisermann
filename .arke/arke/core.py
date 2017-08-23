from __future__ import with_statement

import json
import logging
import os
import re
from collections import OrderedDict
from getpass import getpass
from os.path import dirname, isfile, join

from fabric.api import *
from fabric.colors import *

import tasks as Tasks
from arke.helpers import lbash
from arke.managers.project import ProjectManager
from arke.managers.remote import RemoteManager

# "consts"
auxDirName = '.arke'

# dynamic
manager = None
dynamicHosts = []
options = {}
paths = {}

# setting up somethings
logging.basicConfig(level=logging.WARNING)


def init(path):
  global paths

  checkCoreRequisites()

  paths['base'] = path
  env.colorize_errors = True
  env.use_ssh_config = True
  env.forward_agent = True

  reloadOptions()
  setattr(Tasks, 'project', hostMethodFactory('project', True))


def checkCoreRequisites():
  shouldExit = False
  with hide('everything'), settings(warn_only=True):
    hasJinja = lbash('pip show jinja2')
    if(hasJinja.return_code != 0):
      shouldExit = True
      print red('>> Missing Jinja2. Install it with "pip install jinja2"')

  if(shouldExit):
    exit(1)


def reloadOptions():
  global dynamicHosts
  global options

  loadOptions()

  for oldHostMethodName in dynamicHosts:
    delattr(Tasks, oldHostMethodName)

  if options:
    for hostName in options['hosts']:
      dynamicHosts.append(hostName)
      setattr(Tasks, hostName, hostMethodFactory(hostName, False))


def saveOptions():
  with open(join(paths['base'], 'arke.json'), 'w') as outfile:
    json.dump(options, outfile, indent=2)

  ''' Refresh all loaded paths '''
  setPaths()


def loadOptions(path=None):
  global options
  global paths

  if (path == None):
    path = paths['base']

  jsonFilePath = join(path, 'arke.json')

  if(not isfile(jsonFilePath)):
    if('project' not in env.tasks or 'setup' not in env.tasks and 'reset' not in env.tasks):
      print red('No "arke.json" found.\nRun "fab project setup"')
      exit(1)
  else:
    ''' Reads the arke.json file and strips comments '''
    deployFile = open(jsonFilePath)
    deployFileContent = deployFile.read()
    deployFileContent = re.sub(r'\\\n', '', deployFileContent)
    deployFileContent = re.sub(r'//.*\n', '', deployFileContent)
    deployFile.close()

    options = json.loads(deployFileContent, object_pairs_hook=OrderedDict)


def setPaths():
  global auxDirName
  global paths
  paths['auxFiles'] = join(paths['base'], auxDirName)

  if(env.name != 'project'):
    paths['nginx'] = '/etc/nginx'
    env.hosts = options['hosts'][env.name]['hosts']
    paths['project'] = join(getEnvOption('projectDir'), getEnvOption('name')).rstrip('/')
    paths['publicHTML'] = join(
        paths['project'], getEnvOption('projectPublicDir')).rstrip('/')
    paths['shared'] = join(paths['publicHTML'], 'shared').rstrip('/')
    paths['releases'] = join(paths['publicHTML'], 'releases').rstrip('/')
    paths['current'] = join(paths['publicHTML'], 'current').rstrip('/')
    paths['webRoot'] = join(paths['current'], getEnvOption('webRootDir')).rstrip('/')

# Static Methods


def hostMethodFactory(hostName, isProjectEnv=False):
  def host(*args):
    global manager
    env.name = hostName
    if(isProjectEnv):
      manager = ProjectManager()
    else:
      manager = RemoteManager()
      getSudoPassword()
    setPaths()
  return host


def getSudoPassword():
  if(not env.password):
    env.password = getpass(green('Enter REMOTE sudo password: '))


def getEnvOption(field):
  global options
  return options['hosts'][env.name][field]
