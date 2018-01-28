const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin")

// Phaser webpack config
const phaserModule = path.join(__dirname, '../node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[chunkhash].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new UglifyJSPlugin({
            sourceMap: false
        }),
        new CompressionPlugin({
            test: /\.js/,
            asset: '[path].gz[query]',
            algorithm: 'gzip'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    module: {
        rules: [
            // JS
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')
            },
            {test: /pixi\.js/, use: ['expose-loader?PIXI']},
            {test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
            {test: /p2\.js/, use: ['expose-loader?p2']},

            // CSS
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },

            // Images
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
}
