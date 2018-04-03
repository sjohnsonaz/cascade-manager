var webpack = require('webpack');

module.exports = {
    mode: 'production',
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
        rules: [{
            test: /\.tsx?$/,
            use: ['ts-loader']
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};
