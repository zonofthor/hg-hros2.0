const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const APP_DIR = path.resolve(__dirname, 'src')
const BUILD_DIR = path.resolve(__dirname, 'build')

module.exports = {
  context: APP_DIR,
  entry: {
    main: './main.jsx'
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [      // loaders in wp1
      {
        test: /\.jsx$|\.js$/,
        include: APP_DIR,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        options: {
          presets: ["es2015", "react"],
          plugins: ["transform-react-jsx"]
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|gif|png|svg)$/i,
        loader: 'file-loader?name=assets/img/[name].[ext]'
      }
    ]
  },
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin(
      {
        title: 'CPOE 2.0',
        hash: false,
        filename: "index.html",
        inject: "body"
      }
    )
  ]
}
