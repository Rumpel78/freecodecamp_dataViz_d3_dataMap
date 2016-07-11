var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  bail: false,
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      }
    ],
    resolve: {
      extensions: ['.js']
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
        d3: 'd3'
    })
 ]
};
