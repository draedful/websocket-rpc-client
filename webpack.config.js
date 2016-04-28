var path = require("path");

module.exports = {
    entry: './src/index.js',
    include: [path.resolve(__dirname, './src')],
    output: {
        filename:'index.js',
        libraryTarget: 'umd',
        library: 'websocket-rpc-client',
        umdNamedDefine: true
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