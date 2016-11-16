const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css');

module.exports = isTest => {
    const config = {
        entry: {
            main: './src/Main.tsx',
            server: './src/Server.tsx',
            test: './test/Main.ts',
            testConfiguration: './test/configuration/Configuration.ts'
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
                loader: extractCSS.extract(['css-loader'])
            }, {
                test: /\.less$/,
                loader: extractCSS.extract(['css-loader', 'less-loader'])
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
            include: [
                path.resolve(__dirname, 'src')
            ]
        });
    }

    return config;
};
