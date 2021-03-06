const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'pages'),
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            }
          },
          "postcss-loader",
          {
            loader: 'sass-loader',
            options: {
              includePaths: ["src/styles/globals"],
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            }
          },
        ]
      },
      {
        test: /\.pcss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  stats: {
    warnings: false,
    modules: false,
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'pages': path.resolve(__dirname, 'pages'),
      'styles': path.resolve(__dirname, 'src/styles'),
      'store': path.resolve(__dirname, 'src/store'),
      'models': path.resolve(__dirname, 'src/models'),
      'i18n': path.resolve(__dirname, 'src/i18n'),
      'components': path.resolve(__dirname, 'src/components'),
      'config': path.resolve(__dirname, 'config'),
      'normalize.css': path.join(__dirname, 'node_modules/normalize.css/normalize.css'),
    }
  },
  plugins: [
    new CleanWebpackPlugin(['out']),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};