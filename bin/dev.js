#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const spawn = require("child_process").spawn;

exports.usage =
  "Starts building your lambdas and libs with webpack in watch mode";

exports.run = () => {
  let entries = fs.readdirSync(".");
  entries = entries
    .filter((e) => !e.startsWith(".") && e !== "node_modules")
    .filter((e) => fs.statSync(e).isDirectory());

  entries.forEach((e) => {
    const cwd = path.join(process.cwd(), e);
    const isLib = e.endsWith("-lib");
    const isApi = fs.existsSync(path.join(cwd, "functions"));

    if (!isLib && !isApi) {
      console.log(`Skipping ${e}...`);
      return;
    }

    const p = spawn(
      "npx",
      [
        "webpack",
        "-c",
        path.resolve(
          __dirname,
          "..",
          `webpack.config.${isLib ? "lib." : ""}js`
        ),
        "-w",
        "--color",
      ],
      {
        stdio: "pipe",
        cwd: cwd,
        env: {
          ...process.env,
          FORCE_COLOR: true,
        },
      }
    );

    const prependPrefix = (L) => (d) => {
      console.log(`=== (${L})[${e}] ===`);
      process.stdout.write(d);
    };

    p.stdout.on("data", prependPrefix("I"));
    p.stderr.on("data", prependPrefix("E"));
  });
};
