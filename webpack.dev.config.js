var webpack = require('webpack');

module.exports = {
    entry: {
        'cascadeManager': ['./src/scripts/CascadeManager.ts'],
        'mochaRunner': './src/mocha/BrowserRunner.ts'
    },
    output: {
        filename: './dist/bundle/[name].js',
        libraryTarget: 'var',
        library: '[name]'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('cascadeManager', './dist/bundle/cascadeManager.js')
    ]
};
