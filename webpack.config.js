var HtmlWebpackPlugin = require('html-webpack-plugin'), CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
      bundle: [
        './assets/style.css',
        './react/index'
      ]
    },
    context: __dirname + '/src',
    output: {
        path: __dirname + '/app',
        filename: './[name].js'
    },
    resolve: {
      extensions: ['', '.js']
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js?$/, exclude: /(node_modules)/, loader: 'babel', query: { presets: ['es2015', 'react'] } }
        ]
    },
    presets: [
        'es2015-webpack',
        'react',
    ],
    plugins: [
        new HtmlWebpackPlugin({
          filename: './index.html',
          templateContent: "<div id=root></div><script src=bundle.js></script>",
          inject: false
        }),
        new CopyWebpackPlugin([
           { from: 'electron/main.js', to: 'main.js' }
        ])
    ]
};
