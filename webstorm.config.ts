'use strict'
const path = require('path')

function resolve(dir: string) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json'],
    alias: {
      '~': resolve('src')
    }
  }
}
