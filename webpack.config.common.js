const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InjectBodyPlugin = require('inject-body-webpack-plugin').default

module.exports = {
  entry: './src/index.bs.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Atelier Sophie2 Synthesis Pathfinder',
    }),
    new InjectBodyPlugin({
      content: '<div id="root"></div>',
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
}
