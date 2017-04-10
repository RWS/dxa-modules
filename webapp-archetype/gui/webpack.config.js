const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

module.exports = (isTest, isDebug) => {
    const entries = {
        main: './src/Main.tsx',
        vendor: ['es6-promise', 'react-router', 'ts-helpers', '@sdl/models', '@sdl/controls', '@sdl/controls-react-wrappers']
    };
    const testEntries = Object.assign({
    }, entries);
    const cssLoader = `css-loader?${isDebug ? 'sourceMap' : 'minimize'}`;

    const config = {
        entry: isTest ? testEntries : entries,
        output: {
            path: path.resolve(__dirname + '/dist/assets'),
            publicPath: '/app/assets/',
            filename: '[name].bundle.js'
        },
        devtool: 'source-map',
        resolve: {
            // Needed to resolve dependencies to react inside @sdl/controls-react-wrappers
            alias: {
                React: 'react',
                ReactDOM: 'react-dom',
                ReactDOMServer: 'react-dom/server',
                // Custom theme
                'theme-styles.less': path.resolve(__dirname, 'src/theming/styles.less')
            },
            modules: [
                path.resolve(__dirname),
                path.resolve(__dirname, 'node_modules'),
                path.resolve(__dirname, 'node_modules/@sdl/delivery-ish-dd-webapp-gui/dist/lib')
            ],
            extensions: ['.ts', '.tsx', '.js', '.css', '.less', '.resjson']
        },
        module: {
            rules: [{
                test: /\.(png|jpg|otf|woff(2)?|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }, {
                test: /\.css$/,
                loader: extractCSS.extract([cssLoader, 'postcss-loader'])
            }, {
                test: /\.less$/,
                loader: extractCSS.extract([cssLoader, 'postcss-loader', 'less-loader'])
            }, {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }, {
                test: /\.resjson$/,
                loader: 'json-loader'
            }]
        },
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-dom/server': 'ReactDOMServer',
            'react-addons-test-utils': 'React.addons.TestUtils',
            // Map aliases from  @sdl/controls-react-wrappers
            React: 'React',
            ReactDOM: 'ReactDOM',
            ReactDOMServer: 'ReactDOMServer'
        },
        plugins: [
            extractCSS,
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: '../index.html',
                favicon: './node_modules/@sdl/icons/icons/favicon.ico',
                hash: true,
                excludeChunks: ['test', 'server']
            }),
            new Visualizer({
                filename: '../bundle.stats.html'
            })
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
        const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/app/assets';
        for (let entryName in config.entry) {
            if (entryName !== 'vendor') {
                let entryValue = config.entry[entryName];
                config.entry[entryName] = [entryValue, hotMiddlewareScript];
            }
        }
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    }

    return config;
};
