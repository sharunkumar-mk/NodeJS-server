const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js", // Name of the output bundle
    path: path.resolve(__dirname, "./build"),
  },
};
