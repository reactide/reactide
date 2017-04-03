/**
 * @license: MIT
 */
const path = require('path');
const webpackMerge = require('webpack-merge');
const config = require('./config');
const commonConfig = require('./webpack.common');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return webpackMerge(commonConfig(), {
    devtool: 'source-map',
    output: {
      path: path.resolve('dist'),
      filename: 'bundle.js',
      publicPath: './',
    },
    target: 'electron',
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
        allChunks: true
      }),

      /**
       * Auto inject built file to html
       */
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: config.app.title,
        chunksSortMode: 'dependency'
      }),
    ],
    node: {
      __dirname: false,
      __filename: false
    },
  })
}