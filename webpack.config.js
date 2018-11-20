const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  entry: './renderer/index.js',
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-bundle.js',
    publicPath: '../dist/',
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
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'worker-loader',
          options: {
            name: '[name].js',
          },
        },
      },
      {
        test: /\.css$/,
        use:
          process.env.NODE_ENV === 'production'
            ? [MiniCssExtractPlugin.loader, 'css-loader']
            : ['style-loader', 'css-loader'],
      },
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
        exclude: /(node_modules|(vendor\/.+.bundle\.js))/,
        query: {
          "presets": [
            "@babel/preset-env",
            "@babel/preset-react"
          ]
        }
      }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin()
  ],
  devServer: {
    port: 8081
  }
}
