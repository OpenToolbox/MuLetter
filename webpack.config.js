var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
      bundle: ['./render.js', './style.css']
    },
    context: __dirname + '/',
    output: {
        path: __dirname + '/dist/web/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015', 'react'] } }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          templateContent: '<head><title>MuLetter</title></head><body><div id=root></div></body>',
          inject: true
        })
    ]
};
