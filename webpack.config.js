const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

const dotenvConfig = dotenv.config({
  path: `../.env.${process.env.NODE_ENV}`,
}).parsed;

const output = {
  path: path.join(process.cwd(), "dist"),
  filename: "[name].js",
  libraryTarget: "commonjs",
};

module.exports = {
  target: "node",
  output,
  mode: process.env.OSH_ENV || process.env.NODE_ENV,
  externals: {
    "aws-sdk": "aws-sdk",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(txt|html)$/,
        use: "raw-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(
      Object.keys(dotenvConfig).reduce((acc = {}, key) => ({
        ...acc,
        [`process.env.${key}`]: `"${dotenvConfig[key]}"`,
      }))
    ),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
