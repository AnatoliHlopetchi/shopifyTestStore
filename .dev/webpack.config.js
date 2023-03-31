const path = require('path');
const ExtractCSS = require('mini-css-extract-plugin');

const files = require('../phill.compiler');

const entries = files.reduce((total, item) => {
  const pathList = item.split('/')
  const [name] = pathList[pathList.length - 1].split('.')
  return {
    ...total,
    [name]: item
  }
}, {})

module.exports = {
  entry: entries,
  stats: 'errors-only',
  mode: process.env.NODE_ENV || 'development',
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../assets'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          ExtractCSS.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-import'),
                  require('tailwindcss'),
                  require('autoprefixer')
                ]
              }
            }
          }
        ],
      },
    ],
  },
  plugins: [new ExtractCSS()],
};
