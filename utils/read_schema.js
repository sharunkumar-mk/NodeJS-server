const fs = require("fs");
const path = require("path");

module.exports = function readSchema(dir) {
  const jsonData = fs.readFileSync(path.join(dir, "schema.json"), "utf-8");
  return JSON.parse(jsonData);
};
