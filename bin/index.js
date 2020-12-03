#!/usr/bin/env node

const fs = require("fs");
const command = process.argv[2];

const commands = fs
  .readdirSync(__dirname)
  .filter((f) => f != "index.js")
  .map((f) => f.replace(".js", ""))
  .reduce((acc, c) => {
    return {
      ...acc,
      [c]: require(`./${c}`),
    };
  }, {});

const usage = () => {
  let msg = "Commands:\n";

  Object.entries(commands).forEach(([name, command]) => {
    msg += `${name} - ${command.usage}`;
  });

  return msg;
};

if (!command) {
  return console.log(usage());
}

if (command in commands) {
  commands[command].run();
} else {
  console.error("Unknown command:", command);
}
