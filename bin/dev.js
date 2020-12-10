#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const deepmerge = require("deepmerge");

const configPath = path.resolve(__dirname, "..", `webpack.config.js`);

exports.usage = "Starts building your lambda APIs with webpack in watch mode";

exports.run = () => {
  let entries = fs.readdirSync(".");
  entries = entries
    .filter((e) => !e.startsWith(".") && e !== "node_modules")
    .filter((e) => fs.statSync(e).isDirectory());

  entries.forEach((e) => {
    const cwd = path.join(process.cwd(), e);
    process.chdir(cwd);

    const isApi = fs.existsSync(path.join(cwd, "functions"));

    const overriddesPath = path.join(cwd, "webpack.ext.js");
    const wpOverriddes = fs.existsSync(overriddesPath);

    if (!isApi) {
      console.log(`Skipping ${e}...`);
      process.chdir(path.resolve(cwd, ".."));
      return;
    }

    let config = require(configPath);

    if (wpOverriddes) {
      console.log("Modifying config with", overriddesPath);
      config = require(overriddesPath)(config);
    }

    const files = fs.readdirSync(path.join(cwd, "functions"));
    const entry = {};

    files.forEach((f) => {
      entry[f.replace(/\.(t|j)sx?$/, "")] = `./functions/${f}`;
    });

    config.entry = entry;

    webpack(config).watch({}, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log("===", e, "===");
        console.log(result.toString({ colors: true }));
      }
    });

    delete require.cache[configPath];

    process.chdir(path.resolve(cwd, ".."));
  });
};
