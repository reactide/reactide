var path = require('path');

module.exports = {
    entry: './renderer/index.js',
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'webpack-bundle.js',
        publicPath: ''
    },
	target:'electron',
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
						presets: ['es2015', 'react']
				}
			},
			{
				test: /(\.css|\.scss)$/,
				loaders: ['style', 'css', 'sass']
			}
		]
	}
}
