const path = require('path');

module.exports = {
  entry: './renderer/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'webpack-bundle.js',
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
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          "presets": [
            "@babel/preset-env",
            "@babel/preset-react"
          ]
        }
      }
    ]
  },
  devServer: {
    port: 8081
  }
}
