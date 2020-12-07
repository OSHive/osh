const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

const files = fs.readdirSync(path.join(process.cwd(), "functions"));

const entry = {};

files.forEach((f) => {
  entry[f.replace(/\.(t|j)sx?$/, "")] = `./functions/${f}`;
});

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
  entry,
  output,
  mode: process.env.OSH_ENV,
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
    alias: {
      ssr: path.resolve(__dirname, "client", ".next", "serverless", "pages"),
    },
  },
  devtool: "inline-source-map",
};

if (process.env.OSH_ENV === "production") {
  delete exports.devtool;
}
