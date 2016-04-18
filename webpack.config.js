var HtmlWebpackPlugin = require('html-webpack-plugin'),
ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
      render: './render.js',
      style: './style.css'
    },
    context: __dirname + '/',
    output: {
        path: __dirname + '/dist/web/',
        filename: 'render.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015', 'react'] } }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'index.html',
          inject: false
        })
    ]
};
