const path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: {
		'app': './app/index.jsx',
		'style': './styles.less'
	},
	output: {
		path: path.resolve('dist'),
		filename: '[name].js'
	},
	plugins: [
		new ExtractTextPlugin({
            'filename': '[name].css'
        }),
	],
	module: {
		rules: [
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
						},
						{
							loader: 'less-loader'
						}
					]
				})
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.jsx$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
		]
	},
	'context': path.resolve(__dirname),
	resolve: {
		modules: [
			path.resolve(__dirname + '/app'),
			path.resolve('./node_modules')
		],
		extensions: ['.jsx', '.js', '.less']
	}
}
