const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css');

module.exports = (isTest, isDebug) => {
    const entries = {
        main: './src/Main.tsx',
        server: './src/Server.tsx',
        vendor: ['es6-promise', 'react-router', 'ts-helpers', 'sdl-controls-react-wrappers']
    };
    const testEntries = Object.assign({
        test: './test/Main.ts',
        testConfiguration: './test/configuration/Configuration.ts',
    }, entries);

    const config = {
        entry: isTest ? testEntries : entries,
        output: {
            path: path.resolve(__dirname + '/dist'),
            publicPath: '/',
            filename: '[name].bundle.js'
        },
        devtool: 'source-map',
        resolve: {
            // Needed to resolve dependencies to react inside sdl-control-react-wrappers
            alias: {
                React: 'react',
                ReactDOM: 'react-dom',
                ReactDOMServer: 'react-dom/server'
            },
            modules: [
                path.resolve(__dirname),
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'node_modules')
            ],
            extensions: ['.ts', '.tsx', '.js', '.css', '.less']
        },
        module: {
            rules: [{
                test: /\.(png|jpg|otf|woff(2)?|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }, {
                test: /\.css$/,
                loader: extractCSS.extract(['css-loader', 'postcss-loader'])
            }, {
                test: /\.less$/,
                loader: extractCSS.extract(['css-loader', 'postcss-loader', 'less-loader'])
            }, {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }]
        },
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-dom/server': 'ReactDOMServer',
            'react-addons-test-utils': 'React.addons.TestUtils'
        },
        plugins: [
            extractCSS
        ],
        // What information should be printed to the console
        stats: {
            colors: true,
            reasons: isDebug,
            hash: false,
            version: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            cached: false,
            cachedAssets: false,
        }
    };

    if (isTest) {
        /**
         * Instruments TS source files for subsequent code coverage.
         * See https://github.com/deepsweet/istanbul-instrumenter-loader
         */
        config.module.rules.push({
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
            filename: 'vendor.bundle.js',
            // with more entries, this ensures that no other module
            // goes into the vendor chunk
            minChunks: Infinity
        }));
    }

    if (!isDebug) { // Only for production
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false,
            mangle: false
        }));
    } else { // Only for debug
        // Hot Module Replacement (HMR)
        const hotMiddlewareScript = 'webpack-hot-middleware/client';
        for (let entryName in config.entry) {
            if (entryName !== 'vendor') {
                let entryValue = config.entry[entryName];
                config.entry[entryName] = [entryValue, hotMiddlewareScript];
            }
        }
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        config.plugins.push(new webpack.NoErrorsPlugin());
    }

    return config;
};
