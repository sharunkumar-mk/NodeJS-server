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
    // const modelName = model.name;
    const apiId = model.apiID;
    const modelAttributes = model.attributes;
    const keys = Object.keys(modelAttributes);
    const values = Object.values(modelAttributes);
    const sqlSelect = "SELECT * FROM models ORDER BY created_at DESC";
    const modelData = [];
    const queryLine = `id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at DATETIME DEFAULT NOW(), ${keys
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
    CREATE TABLE ${apiId} (${queryLine})`;
    const modelInfoQuery = `INSERT INTO models SET ?`;
    const apiInsert = "INSERT INTO api SET ?";
    modelInfo = {
      name: apiId,
    };
    apiData = {
      url: `api/${apiId}`,
      model: apiId,
    };
    if (fs.existsSync(`${modelPath}${apiId}`)) {
      res.status(400).send("Model already exist choose different model name");
    } else {
      await executeQuery(createTableQuery);
      await executeQuery(modelInfoQuery, modelInfo);
      await executeQuery(apiInsert, apiData);
      const jsonSchema = JSON.stringify(model);

      //code for create model schema file
      fs.mkdir(`${modelPath}${apiId}`, async (err) => {
        if (err) throw err;
        else {
          fs.writeFileSync(
            `${modelPath}${apiId}/schema.json`,
            jsonSchema,
            "utf-8",
            (err) => {
              if (err) throw err;
            }
          );
          modelIndex = {
            name: `${apiId}`,
            apiId: apiId,
            schemaPath: `models/${apiId}/`,
          };
          models.push(modelIndex);
          fs.writeFileSync(
            "models/index.js",
            `module.exports = ${JSON.stringify(models, null, 2)}`
          );
        }
        const result = await executeQuery(sqlSelect);

        console.log(result);
        result.map((rs) => {
          const data = readSchema(`${modelPath}${rs.name}`);
          data.id = rs.id;
          modelData.push(data);
        });
        res.status(200).send(modelData);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const updateModel = async (req, res) => {
  try {
    const model = req.body.model;
    const modelName = model.name;
    const apiId = model.apiID;
    const modelAttributes = model.attributes;
    const keys = Object.keys(modelAttributes);
    const values = Object.values(modelAttributes);
    const sqlSelect = "SELECT * FROM models ORDER BY created_at DESC";
    const modelData = [];
    const queryLine = `id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at DATETIME DEFAULT NOW(), ${keys
      .map((key, index) => {
        if (values[index].type === "media") {
          return;
        } else if (values[index].type === "Rich text") {
          return `${key} TEXT,`;
        } else if (values[index].type === "Long text") {
          return `${key} LONGTEXT,`;
        } else {
          return `${key} VARCHAR(255),`;
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

    if (fs.existsSync(`${modelPath}${modelName}`)) {
      res.status(400).send("Model already exist choose different model name");
    } else {
      await executeQuery(createTableQuery);
      await executeQuery(modelInfoQuery, modelInfo);
      const jsonSchema = JSON.stringify(model);

      //code for create model schema file
      fs.mkdir(`${modelPath}${modelName}`, async (err) => {
        if (err) throw err;
        else {
          fs.writeFileSync(
            `${modelPath}${modelName}/schema.json`,
            jsonSchema,
            "utf-8",
            (err) => {
              if (err) throw err;
            }
          );
          modelIndex = {
            name: `${modelName}`,
            apiId: apiId,
            schemaPath: `models/${modelName}/`,
          };
          models.push(modelIndex);
          fs.writeFileSync(
            "models/index.js",
            `module.exports = ${JSON.stringify(models, null, 2)}`
          );
        }
        const result = await executeQuery(sqlSelect);
        result.map((rs) => {
          const data = readSchema(`${modelPath}${rs.name}`);
          data.id = rs.id;
          modelData.push(data);
        });
        res.status(200).send(modelData);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const deleteModel = async (req, res) => {
  try {
    const apiId = req.body.apiId;
    console.log(apiId);
    const dropTableQuery = `DROP TABLE IF EXISTS ${apiId}`;
    const deletModelInfoQuery = `DELETE FROM models WHERE name = ?`;
    const sqlSelect = "SELECT * FROM models";
    const modelData = [];
    if (!apiId) {
      res.status(500).send("Bad request: modelName required ");
    } else if (fs.existsSync(`${modelPath}${apiId}`)) {
      fs.rm(`${modelPath}${apiId}`, { recursive: true }, async (err) => {
        if (err) {
          console.log("Error in removing Model");
        } else {
          await executeQuery(deletModelInfoQuery, apiId);
          await executeQuery(dropTableQuery);
          const modelApiIdToRemove = apiId;
          const filteredModels = models.filter(
            (model) => model.name !== modelApiIdToRemove
          );
          fs.writeFileSync(
            "models/index.js",
            `module.exports = ${JSON.stringify(filteredModels, null, 2)}`
          );

          const result = await executeQuery(sqlSelect);
          result.map((rs) => {
            const data = readSchema(`${modelPath}${rs.name}`);
            data.id = rs.id;
            modelData.push(data);
          });
          res.status(200).send(modelData);
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
  const modelId = req.query.id;
  const sqlSelect = modelId
    ? "SELECT * FROM models WHERE id= ?"
    : "SELECT * FROM models ORDER BY created_at DESC";
  const modelData = [];
  try {
    const result = await executeQuery(sqlSelect, [modelId]);
    result.map((rs) => {
      const data = readSchema(`${modelPath}${rs.name}`);
      data.id = rs.id;
      modelData.push(data);
    });

    res.status(200).send(modelData);
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
