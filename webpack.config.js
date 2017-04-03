/**
 * Webpack main config
 * @license: MIT
 */

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./config/webpack.prod')();
    break;
  
  case 'dev':
  case 'development':
    module.exports = require('./config/webpack.dev')();
    break;
  
  default:
    module.exports = require('./config/webpack.dev');
}
