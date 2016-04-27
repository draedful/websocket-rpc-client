var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: './example/index.js',
    include: [path.resolve(__dirname, './example')],
    output: {
        filename:'example/build/index.js'
    },
    resolve: {
        extensions: ['', '.js'],
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ],
        noParse: []
    },
    resolveModules: {
        modulesDirectories: ['node_modules'],
    }
};