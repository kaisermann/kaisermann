import inspect
import sys
import zipfile
from os.path import join, isfile

import pathspec
from fabric.api import *
from fabric.colors import *
from fabric.operations import local


def createBundle(bundleName, baseDir, debug = False):
  manifestPath = join(baseDir, '.deploy')
  if(isfile(manifestPath)):
    print yellow('\n>> Creating new bundle "%s.zip"' % bundleName)

    with open(manifestPath, 'r') as fh:
      spec = pathspec.PathSpec.from_lines('gitwildmatch', fh)
      matches = spec.match_tree(baseDir)

    if(debug):
      for match in matches:
        print(match)
    else:
      with zipfile.ZipFile(join(baseDir, '%s.zip' % bundleName), 'w') as zipFile:
        for match in matches:
          zipFile.write(join(baseDir, match), match)
    print green('>> Done Creating new bundle')
  else:
    print red('>> No ".deploy" found.')
    sys.exit(0)


def ask(question):
  while True:
    response = prompt("%s [y/n] " % question).lower()

    if response in ['y', 'yes']:
      return True

    if response in ['n', 'no']:
      return False

    print red("I didn't understand you. Please specify '(y)es' or '(n)o'.\n")


def hideOutput():
  return hide('running', 'output')


def lbash(cmd, considerHidden=False):
  if considerHidden:
    cmd = 'shopt -s dotglob; %s' % cmd
  return local(cmd, False, '/bin/bash')


def whichOption(options, msg='', input_msg='Answer: '):

  if(msg != ''):
    print('\n%s: ' % (msg))

  print '\n0) [Exit script]'
  for i, option in enumerate(options):
    print "%d) %s" % (i + 1, option)
  print ''

  while True:
    returnValue = raw_input(input_msg)

    if(returnValue.isdigit()):
      returnValue = int(returnValue) - 1
      if(returnValue == -1):
        exit(0)
      elif(returnValue >= 0 and returnValue <= len(options) - 1):
        break

  return returnValue


def runCommandList(list, rootPath='', isLocal=False, insertNewline=False):
  newLineCh = '\n'

  if(not insertNewline):
    newLineCh = ''

  for cmdInfo in list:

    if(len(cmdInfo) == 1):
      cmdInfo = ['', cmdInfo[0]]

    cmdPath = join(rootPath, cmdInfo[0])

    print cyan('%s>>> cd ./%s; %s' % (newLineCh, cmdInfo[0], cmdInfo[1]))
    with hide('running'):
      if(isLocal):
        with lcd(cmdPath):
          lbash(cmdInfo[1])
      else:
        with cd(cmdPath):
          if cmdInfo[1].startswith('sudo'):
            sudo(cmdInfo[1])
          else:
            run(cmdInfo[1])
