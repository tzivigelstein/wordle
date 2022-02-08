const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 8080,
    open: true,
    liveReload: true
  },
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/styles/styles.css', to: 'styles/styles.css' },
        { from: 'src/styles/board.css', to: 'styles/board.css' },
        { from: 'src/styles/rules.css', to: 'styles/rules.css' },
        { from: 'src/styles/stats.css', to: 'styles/stats.css' }
      ]
    })
  ]
}
