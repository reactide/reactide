/**
 * @license: MIT
 */
const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = () => {
  return webpackMerge(commonConfig(), {
    output: {
      path: path.resolve('dist'),
      filename: 'bundle.js',
      publicPath: '/dist/',
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
        allChunks: true
      })
    ],
    target: 'web'
  })
}