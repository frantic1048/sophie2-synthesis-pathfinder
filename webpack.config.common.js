const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InjectBodyPlugin = require('inject-body-webpack-plugin').default

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  resolve: { extensions: ['.js', '.ts', '.tsx'] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
              },
            },
          },
        },
      },
    ],
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
