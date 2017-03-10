const electronHot = require('electron-hot-loader');
electronHot.install();
electronHot.watchJsx(['./components/*.jsx']);
// electronHot.watchCss(['src/assets/**/*.css']);


require('./index.js');