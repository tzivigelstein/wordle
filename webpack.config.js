import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import Dotenv from 'dotenv-webpack'

const { pathname: source } = new URL('src', import.meta.url)
const { pathname: build } = new URL('build', import.meta.url)

export default {
  devServer: {
    watchFiles: source,
    port: 8080,
    open: false,
    liveReload: true,
  },
  entry: './src/js/main.js',
  output: {
    path: build,
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/styles/styles.css', to: 'styles/styles.css' },
        { from: 'src/styles/game.css', to: 'styles/game.css' },
        { from: 'src/styles/rules.css', to: 'styles/rules.css' },
        { from: 'src/styles/stats.css', to: 'styles/stats.css' },
        { from: 'src/styles/settings.css', to: 'styles/settings.css' },
      ],
    }),
    new Dotenv(),
  ],
}
