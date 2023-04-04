const db = require("../Database/db_config.js");
const multer = require("multer");
const storage = require("../config/multer_middleware.js");
const fs = require("fs");
const util = require("util");

const upload = multer({ storage: storage }).single("product-image");

const baseUrl = `${process.env.HOST}:${process.env.PORT_NUMBER}/uploads/`;
const executeQuery = util.promisify(db.query).bind(db);
const publicUploads = "./public/uploads/";

//post service
const postService = (model) => async (req, res) => {
  try {
    upload(req, res, async (err) => {
      const modelName = model.name;
      const keys = Object.keys(model.attributes);
      const values = Object.values(model.attributes);

      const modelData = {};
      keys.map(async (key, index) => {
        if (values[index].type === "media") {
          return;
        } else {
          return (modelData[key] = req.body[key]);
        }
      });
      if (!req.file) {
        const sqlInsert = `INSERT INTO ${modelName} SET ?`;
        await executeQuery(sqlInsert, modelData);
        const data = await executeQuery(`SELECT * FROM ${modelName}`);
        res.send(data);
      } else {
        const fileData = {
          name: req.file.filename,
          mime: req.file.mime,
          size: req.file.size,
          url: baseUrl + req.file.filename,
        };
        const sqlFileInsert = `INSERT INTO files SET ?`;
        const files = await executeQuery(sqlFileInsert, fileData);

        const sqlInsert = `INSERT INTO ${modelName} SET ?`;
        const addedData = await executeQuery(sqlInsert, modelData);

        const fileLinkData = {
          file_id: files.insertId,
          model_id: addedData.insertId,
          model_name: modelName,
          field: "",
        };
        const sqlFileLink = `INSERT INTO file_model_links SET ?`;
        await executeQuery(sqlFileLink, fileLinkData);
        const data = await executeQuery(`SELECT * FROM ${modelName}`);

        // const fileQuery = `SELECT files.*
        // FROM files
        // INNER JOIN file_model_links
        // ON files.id = file_model_links.file_id
        // WHERE model_name = '${modelName}' AND file_model_links.model_id = 'products.id'`;
        // const allFiles = await executeQuery(fileQuery);
        // console.log(allFiles);

        // const fileLinks = await executeQuery(`SELECT * FROM file_model_links`);

        // console.log(allFiles);

        // allFiles.map((rs) => {
        //   const result = data.filter((fl) => fl.id =  ).map
        // })

        // data.map((rs, index) => {
        //   const url = allFiles
        //     .filter((file) => console.log(file.id))
        //     .map((file) => file.url);
        //   rs.url = url;
        //   return rs;
        // });

        res.send(data);
      }

      // data.map((rs) => {
      //   rs.image = baseUrl + rs.image;
      // });
    });
  } catch (err) {
    console.log(err);
  }
};

//get service
const getService = (model) => async (req, res) => {
  const id = req.body.id;
  const sqlSelect = id
    ? `SELECT * FROM ${model.name} WHERE id=?`
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
          return (modelData[key] = req.body[key]);
        }
      });
      // const newProductName = req.body.name;
      if (!id) {
        res.status(500).send("Bad request: id is required...");
        return;
      }
      // const sqlSelect = `SELECT * FROM ${modelName} WHERE id = ?`;
      // const oldModelData = await executeQuery(sqlSelect, [id]);

      // // fs.unlink(publicUploads + oldModelData[0].image, (err) => console.log(err));
      // // const oldModelImage = oldProduct[0].image;
      // // const newProductImage = req.file ? req.file.filename : oldProductsImage;

      // const updateData = {
      //   name: newProductName,
      //   image: newProductImage,
      // };

      const sqlUpdate = `UPDATE ${modelName} SET ? WHERE id = ?`;
      await executeQuery(sqlUpdate, [modelData, id]);

      const data = await executeQuery(`SELECT * FROM ${modelName}`);
      // products.map((rs) => {
      //   rs.image = baseUrl + rs.image;
      // });
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  postService,
  getService,
  putService,
};
