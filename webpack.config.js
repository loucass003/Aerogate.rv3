const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
	mode: 'development',
	entry: {
		app: ['./src/index.js']
	},
	devServer: {
		host: '0.0.0.0',
		port: 3001,
		disableHostCheck: true,
		hot: true
	},
	output: {
		path: path.join(__dirname, "build"),
		publicPath: '/build/',
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'index.html')
		})
	],
	module: {
		rules: [{
			test: /\.css$/,
			loaders: [
				"style-loader",
				"css-loader",
				"autoprefixer-loader?browsers=last 2 version"
			]
		},{
			test: /\.html$/,
			loader: "raw-loader" // loaders: ['raw-loader'] is also perfectly acceptable.
		}]
	}
};

module.exports = config;