const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './renderer/index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/dist',
  },
  target: 'electron',
	node: {
		__dirname: false,
		__filename: false
	},
  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-2'],
        },
      }, {
        test: /(\.css|\.scss)$/,
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
