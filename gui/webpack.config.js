const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css');

module.exports = (isTest, isDebug) => {
    const config = {
        entry: {
            main: './src/Main.tsx',
            server: './src/Server.tsx',
            test: './test/Main.ts',
            testConfiguration: './test/configuration/Configuration.ts',
            vendor: ['es6-promise', 'react-router', 'slug', 'ts-helpers']
        },
        output: {
            path: path.resolve(__dirname + '/dist'),
            filename: '[name].bundle.js'
        },
        devtool: 'source-map',
        resolve: {
            modules: [
                path.resolve(__dirname),
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'node_modules')
            ],
            extensions: ['.ts', '.tsx', '.js', '.css', '.less']
        },
        module: {
            loaders: [{
                test: /\.otf$/,
                loader: 'url-loader?limit=100000'
            }, {
                test: /\.css$/,
                loader: extractCSS.extract([
                    'css-loader',
                    'postcss-loader'
                ])
            }, {
                test: /\.less$/,
                loader: extractCSS.extract([
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ])
            }, {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }]
        },
        plugins: [
            extractCSS
        ]
    };

    if (isTest) {
        /**
         * Instruments TS source files for subsequent code coverage.
         * See https://github.com/deepsweet/istanbul-instrumenter-loader
         */
        config.module.loaders.push({
            enforce: 'post',
            test: /\.tsx?$/,
            loader: 'istanbul-instrumenter-loader',
            query: {
                esModules: true
            },
            include: [
                path.resolve(__dirname, 'src')
            ]
        });
    } else {
        config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js'
        }));
    }

    if (!isDebug) {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false,
            mangle: false
        }));
    }

    return config;
};
