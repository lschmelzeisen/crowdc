const path = require('path');

var phaserModulePath = path.join(__dirname, '../node_modules/phaser/');

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: './dist'
    }, module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {test: /pixi\.js/, loader: 'expose-loader?PIXI'},
            {test: /phaser-split\.js$/, loader: 'expose-loader?Phaser'},
            {test: /p2\.js/, loader: 'expose-loader?p2'},]
    }, output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'phaser': path.join(phaserModulePath, 'build/custom/phaser-split.js'),
            'pixi': path.join(phaserModulePath, 'build/custom/pixi.js'),
            'p2': path.join(phaserModulePath, 'build/custom/p2.js')

        }
    }
};

