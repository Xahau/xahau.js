'use strict'
const { merge } = require('webpack-merge')
const { getDefaultConfiguration, wrapForEnv } = require('../../webpack.config')

module.exports = wrapForEnv(
  'xah',
  merge(getDefaultConfiguration(), require('./webpack.base.config')),
)
