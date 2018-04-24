const path = require('path');
const webpack = require('webpack');
const devFlag = new webpack.DefinePlugin({
	__DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

const config = {
	mode: 'development',
	entry: {
		app: ['./src/index.js']
	},
	devServer: {
		host: '0.0.0.0',
		port: 3001
	},
	output: {
		path: path.join(__dirname, "build"),
		publicPath: '/build/',
		filename: 'bundle.js'
	},
	plugins: [devFlag],
	module: {
		rules: [{
			test: /\.css$/,
			loaders: [
				"style-loader",
				"css-loader",
				"autoprefixer-loader?browsers=last 2 version"
			]
		}]
	}
};

module.exports = config;