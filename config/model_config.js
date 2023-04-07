const fs = require("fs");
const modelPath = "models/";
const db = require("../Database/db_config.js");
const util = require("util");
const models = require("../models/index.js");
const readSchema = require("../utils/read_schema.js");

const executeQuery = util.promisify(db.query).bind(db);

const createModel = async (req, res) => {
  try {
    const model = req.body.model;
    const modelName = model.name;
    const modelAttributes = model.attributes;

    const keys = Object.keys(modelAttributes);
    const values = Object.values(modelAttributes);

    const queryLine = `id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ${keys
      .map((key, index) => {
        if (values[index].type === "media") {
          return;
        } else {
          return `${key} ${
            values[index].type === "richtext" ? "TEXT(255)" : "VARCHAR(255)"
          },`;
        }
      })
      .join("")
      .slice(0, -1)}`;

    const createTableQuery = `
    CREATE TABLE ${modelName} (${queryLine})`;
    const modelInfoQuery = `INSERT INTO models SET ?`;
    modelInfo = {
      name: modelName,
    };
    const selectModelInfoQuery = `SELECT * FROM models`;

    if (fs.existsSync(`${modelPath}${modelName}`)) {
      res.send("Model already exist choose different model name");
    } else {
      await executeQuery(createTableQuery);
      await executeQuery(modelInfoQuery, modelInfo);
      const jsonSchema = JSON.stringify(model);
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
          modelIndex = {
            name: `${modelName}`,
            schemaPath: `models/${modelName}/`,
          };
          models.push(modelIndex);
          fs.writeFileSync(
            "models/index.js",
            `module.exports = ${JSON.stringify(models, null, 2)}`
          );
        }
      });

      const data = await executeQuery(selectModelInfoQuery);
      res.send(data);
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteModel = async (req, res) => {
  try {
    const modelName = req.body.model;
    const dropTableQuery = `DROP TABLE IF EXISTS ${modelName}`;
    const deletModelInfoQuery = `DELETE FROM models WHERE name = ?`;
    const selectModelInfoQuery = `SELECT * FROM models`;
    if (!modelName) {
      res.status(500).send("Bad request: modelName required ");
      return;
    } else if (fs.existsSync(`${modelPath}${modelName}`)) {
      fs.rm(`${modelPath}${modelName}`, { recursive: true }, async (err) => {
        if (err) {
          console.log("Error in removing Model");
        } else {
          await executeQuery(dropTableQuery);
          await executeQuery(deletModelInfoQuery, modelName);
          const modelNameToRemove = modelName;
          const filteredModels = models.filter(
            (model) => model.name !== modelNameToRemove
          );
          fs.writeFileSync(
            "models/index.js",
            `module.exports = ${JSON.stringify(filteredModels, null, 2)}`
          );
          const data = await executeQuery(selectModelInfoQuery);
          res.send(data);
        }
      });
    } else {
      res.status(404).send("Model not found");
    }
  } catch (err) {
    console.log(err);
  }
};

const getModel = async (req, res) => {
  const modelName = req.body.name;

  const sqlSelect = modelName
    ? `SELECT id FROM models WHERE name=?`
    : `SELECT * FROM models`;
  try {
    const result = await executeQuery(sqlSelect, [modelName]);
    if (!modelName) {
      res.status(500).send(result);
    } else {
      const model = readSchema(`${modelPath}${modelName}`);
      model.id = result[0].id;
      const response = {
        model,
      };

      res.status(200).send(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  createModel,
  deleteModel,
  getModel,
};
