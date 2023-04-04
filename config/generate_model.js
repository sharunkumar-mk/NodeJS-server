const fs = require("fs");
const modelPath = "models/";
const rootPath = "../";
const db = require("../Database/db_config.js");
const util = require("util");
const models = require("../models/index.js");

const executeQuery = util.promisify(db.query).bind(db);

exports.generateModel = async (req, res) => {
  try {
    const model = req.body.model;
    const modelName = model.name;
    const modelAttributes = model.attributes;

    const keys = Object.keys(modelAttributes);
    const values = Object.values(modelAttributes);

    const queryLine = `id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ${keys
      .map((key, index) => {
        if (values[index].type === "media") {
          return "";
        } else {
          return `${key} ${
            values[index].type === "richtext" ? "TEXT(255)" : "VARCHAR(255)"
          }`;
        }
      })
      .join(", ")}`;

    const createTableQuery = `
    CREATE TABLE ${modelName} (${queryLine.slice(0, -2)})`;

    if (fs.existsSync(`${modelPath}${modelName}`)) {
      res.send("Model name already exist choose different name");
    } else {
      await executeQuery(createTableQuery);

      const jsonSchema = JSON.stringify(model);
      const modelData = `const { readSchema } = require("../../utils/read_schema.js");
      exports.${modelName} = readSchema(__dirname);`;

      // indexData = `const { ${modelName} } = require("./models/${modelName}/${modelName}.js"); post(app, ${modelName});`;
      //code for create model schema file
      fs.mkdir(`${modelPath}${modelName}`, (err) => {
        if (err) throw err;
        else {
          fs.writeFile(
            `${modelPath}${modelName}/schema.json`,
            jsonSchema,
            "utf-8",
            (err) => {
              if (err) throw err;
            }
          );
          fs.writeFile(
            `${modelPath}${modelName}/${modelName}.js`,
            modelData,
            "utf-8",
            (err) => {
              if (err) throw err;
            }
          );

          newModel = {
            name: `${modelName}`,
            schemaPath: `models/${modelName}/`,
          };

          models.push(newModel);

          fs.writeFileSync(
            "models/index.js",
            `module.exports = ${JSON.stringify(models, null, 2)}`
          );
        }
      });
      res.send("Model and table created successfully");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteModel = async (req, res) => {
  try {
    const modelName = req.body.model;
    const dropTableQuery = `DROP TABLE IF EXISTS ${modelName}`;
    if (!modelName) {
      res.status(500).send("Bad request: modelName required ");
      return;
    } else if (fs.existsSync(`${modelPath}${modelName}`)) {
      fs.rm(`${modelPath}${modelName}`, { recursive: true }, async (err) => {
        if (err) {
          console.log("Error in removing Model");
        } else {
          await executeQuery(dropTableQuery);
          const modelNameToRemove = modelName;

          const filteredModels = models.filter(
            (model) => model.name !== modelNameToRemove
          );
          fs.writeFileSync(
            "models/index.js",
            `module.exports = ${JSON.stringify(filteredModels, null, 2)}`
          );

          console.log("Model removed successfully");
          res.send("Model deleted");
        }
      });
    } else {
      res.status(404).send("Model not found");
    }
  } catch (err) {
    console.log(err);
  }
};
