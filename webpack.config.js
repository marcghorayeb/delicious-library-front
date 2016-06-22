/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

function baseConf(options) {
    return {
        entry: options.entry,
        output: Object.assign({ // Compile into js/build.js
            path: path.resolve(process.cwd(), 'build'),
            publicPath: '/delicious-library/',
        }, options.output), // Merge with env dependent settings
        module: {
            loaders: [{
                test: /\.js$/, // Transform all .js files required somewhere with Babel
                loader: 'babel',
                exclude: /node_modules/,
                query: options.babelQuery,
            }, {
                // Transform our own .css files with PostCSS and CSS-modules
                test: /\.css$/,
                exclude: /node_modules/,
                loader: options.cssLoaders,
            }, {
                // Do not transform vendor's CSS with CSS-modules
                // The point is that they remain in global scope.
                // Since we require these CSS files in our JS or CSS files,
                // they will be a part of our compilation either way.
                // So, no need for ExtractTextPlugin here.
                test: /\.css$/,
                include: /node_modules/,
                loaders: ['style-loader', 'css-loader'],
            }, {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
            }, {
                test: /\.(jpg|png|gif)$/,
                loader: 'file-loader',
            }, {
                test: /\.html$/,
                loader: 'html-loader',
            }, {
                test: /\.json$/,
                loader: 'json-loader',
            }],
        },
        plugins: options.plugins.concat([
            // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
            // inside your code for any environment checks; UglifyJS will automatically
            // drop any unreachable code.
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                },
            }),
        ]),
        postcss: () => options.postcssPlugins,
        resolve: {
            modules: ['app', 'node_modules'],
            extensions: [
                '',
                '.js',
                '.jsx',
                '.react.js',
            ],
            packageMains: [
                'jsnext:main',
                'main',
            ],
        },
        devtool: options.devtool,
        target: 'web', // Make web variables accessible to webpack, e.g. window
        // stats: false, // Don't show stats in the console
        progress: true,
        colors: true
    };
}

/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

// PostCSS plugins
// const cssnext = require('postcss-cssnext');
// const postcssFocus = require('postcss-focus');
// const postcssReporter = require('postcss-reporter');

let conf = baseConf({
  // In production, we skip all hot-reloading stuff
  entry: [
    path.join(process.cwd(), 'app/app.js'),
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].js'
  },

  plugins: [
    // Merge all duplicate modules
    new webpack.optimize.DedupePlugin(),

    // Minify and optimize the JavaScript
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false, // ...but do not show warnings in the console (there is a lot of them)
      },
    }),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    })
  ],
})
module.exports = conf;
