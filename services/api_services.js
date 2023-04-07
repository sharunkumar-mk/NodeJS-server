const db = require("../Database/db_config.js");
const multer = require("multer");
const storage = require("../config/media_config.js");
const fs = require("fs");
const util = require("util");

const baseUrl = `${process.env.HOST}:${process.env.PORT_NUMBER}/uploads/`;
const executeQuery = util.promisify(db.query).bind(db);
const publicUploads = "./public/uploads/";

//post service
const postService = (model) => async (req, res) => {
  try {
    const modelName = model.name;
    const keys = Object.keys(model.attributes);
    const values = Object.values(model.attributes);
    const modelData = {};
    const selectedMedia = {};
    keys.map(async (key, index) => {
      if (values[index].type === "media") {
        selectedMedia[key] = req.body[key];
        return;
      } else {
        if (req.body[key] != null) {
          return (modelData[key] = req.body[key]);
        } else return;
      }
    });
    const ids = Object.values(selectedMedia)[0];
    const field = Object.keys(selectedMedia)[0];

    const modelInsert = `INSERT INTO ${modelName} SET ?`;
    const fileSelect = `SELECT * FROM files WHERE id IN (?)`;
    if (Object.keys(modelData).length == 0) {
      res.status(400).send("Empty data");
    } else {
      const modelInserted = await executeQuery(modelInsert, modelData);
      console.log(modelInserted.insertId);
      const data = await executeQuery(`SELECT * FROM ${modelName}`);
      const file = await executeQuery(fileSelect, [ids]);

      if (ids && ids.length > 0) {
        const modelId = modelInserted.insertId;
        const insertLinksQuery = `INSERT INTO file_model_links (file_id, model_id, model_name, field) VALUES (?, ?, ?,?)`;
        for (let i = 0; i < ids.length; i++) {
          await executeQuery(insertLinksQuery, [
            ids[i],
            modelId,
            modelName,
            field,
          ]);
        }
      }

      console.log(file);
      res.send(data);
    }
  } catch (err) {
    console.log(err);
  }
};

//get service
const getService = (model) => async (req, res) => {
  const id = req.body.id;
  const keys = Object.keys(model.attributes);
  const values = Object.values(model.attributes);

  const imageUrlField = keys.find((key, index) => {
    return values[index].type === "media";
  });

  const sqlSelect = imageUrlField
    ? id
      ? `
      SELECT ${model.name}.*, files.path AS ${imageUrlField}
      FROM ${model.name}
      INNER JOIN file_model_links ON ${model.name}.id = file_model_links.model_id
      INNER JOIN files ON file_model_links.file_id = files.id
      WHERE ${model.name}.id = ?
    `
      : `
      SELECT ${model.name}.*, files.path AS ${imageUrlField}
      FROM ${model.name}
      INNER JOIN file_model_links ON ${model.name}.id = file_model_links.model_id
      INNER JOIN files ON file_model_links.file_id = files.id
    `
    : `SELECT * FROM ${model.name}`;

  try {
    const result = await executeQuery(sqlSelect, [id]);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

//put service
const putService = (model) => async (req, res) => {
  try {
    upload(req, res, async (err) => {
      const id = req.body.id;
      const modelName = model.name;
      const keys = Object.keys(model.attributes);
      const values = Object.values(model.attributes);

      const modelData = {};
      keys.map(async (key, index) => {
        if (values[index].type === "media") {
          return;
        } else {
          if (req.body[key] != null) {
            return (modelData[key] = req.body[key]);
          } else return;
        }
      });

      if (!id) {
        res.status(400).send("Bad request: id is required...");
        return;
      }

      const sqlUpdate = `UPDATE ${modelName} SET ? WHERE id = ?`;
      await executeQuery(sqlUpdate, [modelData, id]);
      const data = await executeQuery(`SELECT * FROM ${modelName}`);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

//delete service
const deleteService = (model) => async (req, res) => {
  const ids = req.body.ids;
  const modelName = model.name;
  const keys = Object.keys(model.attributes);
  const values = Object.values(model.attributes);

  const isMedia = keys.find((key, index) => {
    return values[index].type === "media";
  });

  if (!ids || ids.length === 0) {
    res.status(400).send("Bad request: ids required");
    return;
  }
  try {
    await executeQuery(`DELETE FROM ${modelName} WHERE id IN (?)`, [ids]);
    await executeQuery(`DELETE FROM file_model_links WHERE model_id IN(?)`, [
      ids,
    ]);

    const data = await executeQuery(`SELECT * FROM ${modelName}`);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server errror");
  }
};

module.exports = {
  postService,
  getService,
  putService,
  deleteService,
};
