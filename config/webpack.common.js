/**
 * @license: MIT
 */
const path = require('path');

/**
 * Webpack Plugin
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = () => {
  return {
    entry: './src/index',
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
       * Copy assets files
       */
      new CopyWebpackPlugin([
				{ from: 'src/assets', to: 'assets' }
			]),
    ]
  }
}

