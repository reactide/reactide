var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('../index.js'); // use inside the npm package

// We use the NODE_ENV in our automation commands to differentiate environments
var production =
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'preprod';

// Setup our plugins.
var plugins = [
  // attaches the webpack-generated JS to our main HTML file
  new HtmlWebpackPlugin({template: './src/index.html'}),
  // create global access to the NODE_ENV within our Webpacked code:
  new webpack.DefinePlugin({
    __ENV__: JSON.stringify(process.env.NODE_ENV)
  }),
  // http://gaearon.github.io/react-hot-loader/getstarted/
  new webpack.HotModuleReplacementPlugin(),
  // Mac doesn't care about case, but linux servers do, so enforce...
  new CaseSensitivePathsPlugin()
];

// In production we do a bit more...
if (production) {
  plugins.concat(
    [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]);
}

const devEntry = [
    'webpack-dev-server/client?http://0.0.0.0:3000', // tells client where to get hot reloads
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    'babel-polyfill', // for full ES6 compatibility on older devices
    './src/init.js'
  ];
const prodEntry = [
    'babel-polyfill', // for full ES6 compatibility on older devices
    './src/init.js'
];

const theEntry = (production) ? prodEntry : devEntry;

module.exports = {

  // Bundle to our dist folder as a main.js file.
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/'
  },

  devtool: 'sourcemap',

  // Our master entry point.
  entry: theEntry,

  // Extra helpers to make require or include easier.
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      // in dev only, hotload
      loader: production ? 'babel' : 'react-hot!babel',
      // other babel options are specified in .babelrc
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },

  plugins: plugins
};
