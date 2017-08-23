"""Arke fabfile"""
# coding: utf-8

import importlib
import inspect
import os
import sys

'''
Adds the .arke/arke directory to python's include path.
The 'sys.path....' line must come before the 'from arke import *' one.
'''
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.arke/'))

'''
Importing arke module
'''
ARKE = importlib.import_module('arke')


'''
Initializes arke
'''

ARKE.Core.init(os.path.dirname(__file__))
for method in inspect.getmembers(ARKE.Tasks):
  if not method[0].startswith('_'):
    setattr(
        __import__(__name__),
        method[0],
        getattr(ARKE.Tasks, method[0])
    )
