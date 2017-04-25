const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

module.exports = (isTest, isDebug) => {
    const entries = {
        main: './src/Main.tsx',
        server: './src/Server.tsx',
        lib: './src/Lib.ts',
        vendor: ['classnames', 'es6-promise', 'react-router', 'ts-helpers', '@sdl/models', '@sdl/controls', '@sdl/controls-react-wrappers', 'babel-polyfill']
    };
    const testEntries = Object.assign({
        test: './test/Main.ts',
        testConfiguration: './test/configuration/Configuration.ts',
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
                // This alias is needed so customization can happen on top of the theming folder
                // by using dependency injection techniques
                'theme-styles.less': path.resolve(__dirname, 'src/theming/styles.less'),

                // Controls aliases
                '@sdl/dd': path.resolve(__dirname, 'src/components')
                // Presentations
                // '@sdl/dd/presentations/tile': path.resolve(__dirname, 'src/components/presentation/Tile.tsx'),
                // '@sdl/dd/presentations/breadcrumbs': path.resolve(__dirname, 'src/components/presentation/Breadcrumbs.tsx'),
                // '@sdl/dd/presentations/content-navigation': path.resolve(__dirname, 'src/components/presentation/ContentNavigation.tsx'),
                // '@sdl/dd/presentations/error': path.resolve(__dirname, 'src/components/presentation/Error.tsx'),
                // '@sdl/dd/presentations/error-toc': path.resolve(__dirname, 'src/components/presentation/ErrorToc.tsx'),
                // '@sdl/dd/presentations/navigation-menu': path.resolve(__dirname, 'src/components/presentation/NavigationMenu.tsx'),
                // '@sdl/dd/presentations/search-bar': path.resolve(__dirname, 'src/components/presentation/SearchBar.tsx'),
                // '@sdl/dd/presentations/toc': path.resolve(__dirname, 'src/components/presentation/Toc.tsx'),
                // '@sdl/dd/presentations/top-bar': path.resolve(__dirname, 'src/components/presentation/TopBar.tsx'),
                // '@sdl/dd/presentations/version-selector': path.resolve(__dirname, 'src/components/presentation/VersionSelector.tsx'),

                // // Containers
                // '@sdl/dd/containers/app': path.resolve(__dirname, 'src/components/container/App/App.tsx'),
                // '@sdl/dd/containers/error-content': path.resolve(__dirname, 'src/components/container/ErrorContent/ErrorContentPresentation.tsx'),
                // '@sdl/dd/containers/product-families-list': path.resolve(__dirname, 'src/components/container/ProductFamiliesList/ProductFamiliesList.tsx'),
                // '@sdl/dd/containers/tiles-list': path.resolve(__dirname, 'src/components/container/TilesList/TilesList.tsx'),

                // // Unsorted
                // '@sdl/dd/components/content-language-warning': path.resolve(__dirname, 'src/components/ContentLanguageWarning/ContentLanguageWarningPresentation.tsx'),
                    // '@sdl/dd/components/dropdown': path.resolve(__dirname, 'src/components/Dropdown/Dropdown.tsx'),
                // '@sdl/dd/components/home': path.resolve(__dirname, 'src/components/Home/HomePresentation.tsx'),
                // '@sdl/dd/components/page': path.resolve(__dirname, 'src/components/Page/PagePresentation.tsx'),
                // '@sdl/dd/components/page-link': path.resolve(__dirname, 'src/components/PageLink/PageLink.tsx'),
                // '@sdl/dd/components/publication-content': path.resolve(__dirname, 'src/components/PublicationContent/PublicationContentPresentation.tsx'),
                // '@sdl/dd/components/publications-list': path.resolve(__dirname, 'src/components/PublicationsList/PublicationsListPresentation.tsx')
            },
            modules: [
                path.resolve(__dirname),
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'node_modules'),
                path.resolve(__dirname, 'dist/lib')
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
                    loader: ['ts-lib-loader', 'ts-loader']
            }, {
                test: /\.resjson$/,
                    loader: 'json-loader'
            }]
        },
        resolveLoader: {
            modules: ["./build/webpack-loaders", "web_loaders", "web_modules", "node_loaders", "node_modules"],
            extensions: [".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
            mainFields: ["webpackLoader", "webLoader", "loader", "main"]
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
                excludeChunks: ['lib', 'test', 'server']
            }),
            /* Disabled visualizer as it takes too much memory, only enable when needed
            new Visualizer({
                filename: '../bundle.stats.html'
            })*/
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
