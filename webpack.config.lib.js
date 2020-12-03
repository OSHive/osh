const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",
  entry: "./lib/index.ts",
  output: {
    path: path.join(process.cwd(), "dist"),
    filename: "index.js",
    libraryTarget: "commonjs",
  },
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
    ],
  },
  plugins: [new CopyPlugin({ patterns: ["package.json"] })],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "inline-source-map",
};
