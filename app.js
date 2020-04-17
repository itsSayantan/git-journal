#!/usr/bin/env node

const { appOpen } = require('./flow/app-open')
const util = require('util')

const dl = util.debuglog('git-notes')
global.dl = dl

appOpen()