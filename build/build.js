process.env.NODE_ENV = "production";
const webpack = require("webpack");

const webpackConfig = require("./webpack.prod.js");

webpack(webpackConfig, (error) => {
  console.log(error);
});
