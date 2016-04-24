var path = require('path'),
    webpack = require('webpack');

module.exports = {
  entry: {
    main: './app/main.js',
    vendor: [
      'flux',
      'react',
      'react-dom'
    ]
  },
  output: {
    path: __dirname + '/public/build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /.js$/, loader: 'babel-loader', exclude: new RegExp('node_modules') }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
  ]
};
