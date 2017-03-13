// karma.conf.js
const webpack = require('webpack');
const wpc = require('./webpack.config');
const CaseSensitivePathsPlugin = require('../index.js'); // use inside the npm package


module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS', 'Chrome'],
    singleRun: true,
    frameworks: ['jasmine'],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests.webpack.js'
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-sourcemap',
      resolve: wpc.resolve, // get from main webpack config
      module: {
        loaders: wpc.module.loaders, // get from main webpack config
      },
      watch: true,
      plugins: [
        new webpack.DefinePlugin({
          __ENV__: JSON.stringify('dev') // always test in 'dev' environment
        }),
        // Mac doesn't care about case, but linux servers do, so enforce...
        new CaseSensitivePathsPlugin()
      ],
    },
    webpackServer: {
      noInfo: true
    }
  });
};
