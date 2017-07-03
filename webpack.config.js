var webpack = require('webpack');

module.exports = {
    entry: {
        'cascadeManager': ['./src/scripts/CascadeManager.ts']
    },
    output: {
        filename: './dist/bundle/[name].min.js',
        libraryTarget: 'var',
        library: '[name]'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    externals: {
        mocha: 'mocha',
        chai: 'chai'
    },
    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};
