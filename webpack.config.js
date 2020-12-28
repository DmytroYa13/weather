const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {

  // productionSourceMap: true, // NOTE: this is default
  // configureWebpack: {
  //   devtool: 'source-map',
  // },



  entry: './src/index.js',
  module: {
    rules: [
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  devServer: {
    port: 4200
  },

 

  
  plugins: [
    new HTMLPlugin({
      template: './src/index.html'
    })
  ],

}
