const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const webpack = require("webpack") // to access built-in plugins

module.exports = {
  mode: "development",
  entry: { app: "./src/js/index.js" },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|ico|webmanifest|ttf|svg|wav)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
  devtool: "inline-source-map",
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "TimbrePlay",
      template: "src/index.html",
    }),
  ],
  devServer: {
    hot: true,
    contentBase: "./build",
    overlay: true,
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
}
