/**
 * @license: MIT
 */
const path = require('path');
const { spawn } = require('child_process');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const config = require('./config');

/**
 * webpack plugins
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const publicPath = `http://${config.devServer.host}:${config.devServer.port}/dist`;

module.exports = () => {
  return webpackMerge(commonConfig(), {
    devtool: 'cheap-eval-source-map',
    output: {
      path: path.resolve('dist'),
      filename: 'bundle.js',
      publicPath: './',
      libraryTarget: 'commonjs2'
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      }),

      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.PORT': JSON.stringify(config.devServer.port)
      }),

      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: config.app.title,
        chunksSortMode: 'dependency'
      }),

      // Force webpack dev server write file to disk
      new WriteFilePlugin()
    ],
    target: 'electron-renderer',
    node: {
      __dirname: false,
      __filename: false
    },
    devServer: {
      port: config.devServer.port,
      publicPath,
      inline: true,
      hot: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      contentBase: path.join(__dirname, 'dist'),
      watchOptions: {
        aggregateTimeout: 300,
        poll: 100
      },
      historyApiFallback: {
        verbose: true,
        disableDotRule: false,
      },
      setup() {
        if (process.env.START_HOT) {
          spawn(
            'npm',
            ['run', 'electron:dev'],
            { shell: true, env: process.env, stdio: 'inherit' }
          )
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError));
        }
      }
    }
  })
}