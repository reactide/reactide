/**
 * @license: MIT
 */
const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = () => {
  return webpackMerge(commonConfig(), {
    devtool: 'cheap-eval-source-map',
    output: {
      path: path.resolve('dist'),
      filename: 'bundle.js',
      publicPath: '/dist/',
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      })
    ],
    target: 'web',
    devServer: {
      port: 8081,
      historyApiFallback: {
        index: '/dist/'
      }
    },
    node: {
      fs: 'empty'
    }
  })
}