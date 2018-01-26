const path = require('path');
const phaserModulePath = path.join(__dirname, '../node_modules/phaser/');

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: './dist'
    }, plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
    ], module: {
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
            {test: /p2\.js/, loader: 'expose-loader?p2'},
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ],

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

