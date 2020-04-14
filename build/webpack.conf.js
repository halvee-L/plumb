"use strict";

const path = require("path");

const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    compress: true,
    host: "localhost",
    hot: true,
    open: true,
    overlay: true,
    port: 9091,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: "plumb test",
      minify: {},
      filename: "index.html",
      template: "index.html",
    }),
  ],
};
