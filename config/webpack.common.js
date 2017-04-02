/**
 * @license: MIT
 */
const path = require('path');
const config = require('./config');

/**
 * Webpack Plugin
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = () => {
  return {
    entry: './renderer/main',
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [path.resolve('renderer'), 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: 'css-loader!sass-loader?sourceMap'
					})
        },
        {
          test: /\.(eot|woff)$/,
          use: 'file-loader',
        },
      ],
    },
    plugins: [
      /**
       * Auto inject built file to html
       */
      new HtmlWebpackPlugin({
        template: './renderer/index.html',
        title: config.app.title,
        chunksSortMode: 'dependency'
      }),
      /**
       * Copy assets files
       */
      new CopyWebpackPlugin([
				{ from: 'renderer/assets', to: 'assets' }
			]),
    ]
  }
}

