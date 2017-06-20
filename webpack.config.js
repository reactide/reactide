const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './renderer/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  // Compile for Electron for main process.
  target: 'electron-main',
  // configure whether to polyfill or mock certain Node.js globals
	node: {
		__dirname: false,
		__filename: false
	},
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.(css|scss|sass)$/,
        loaders: ['style', 'css', 'sass'],
      }, {
        test: /\.(eot|woff)$/,
        loader: 'file-loader',
      },
    ],
  },
  devServer: {
    port: 8081
  }
}
