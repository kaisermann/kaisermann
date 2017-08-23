import core


def setup():
  core.manager.setup()


def checkRequisites():
  core.manager.checkRequisites()


def deploy(deployMode = 'bundle', optBranch = 'master'):
  core.manager.deploy(deployMode, optBranch)


def service_restart(name):
  core.manager.service_restart(name)


def service_reload(name):
  core.manager.service_reload(name)


def cleanup_releases():
  core.manager.cleanup_releases(keep)


def fixPermissions(folderPath=0):
  core.manager.fixPermissions(folderPath)


def install():
  core.manager.install()


def reset():
  core.manager.reset()


def bundle(extra = ''):
  core.manager.bundle(extra)
