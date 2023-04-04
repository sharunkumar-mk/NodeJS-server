const db = require("../../Database/db_config.js");
const multer = require("multer");
const storage = require("../../config/multer_middleware.js");
const fs = require("fs");
const util = require("util");

const upload = multer({ storage: storage }).single("product-image");

const baseUrl = `${process.env.HOST}:${process.env.PORT_NUMBER}/uploads/`;
const executeQuery = util.promisify(db.query).bind(db);
const publicUploads = "./public/uploads/";

// add new product
exports.addProduct = (module) => async (req, res) => {
  try {
    upload(req, res, async (err) => {
      const fields = await executeQuery(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${module}'`
      );
      console.log(fields);
      fields.map((rs) => {
        console.log(rs.COLUMN_NAME);
      });

      const productName = req.body.name;
      const productImage = req.file ? req.file.filename : "Default";
      const product = {
        name: productName,
        image: productImage,
      };
      const sqlInsert = `INSERT INTO ${module} SET ?`;
      await executeQuery(sqlInsert, product);
      const products = await executeQuery(`SELECT * FROM ${module}`);
      products.map((rs) => {
        rs.image = baseUrl + rs.image;
      });
      res.send(products);
    });
  } catch (err) {
    console.log(err);
  }
};

//get product
exports.getProduct = async (req, res) => {
  const id = req.body.id;
  const sqlSelect = id
    ? "SELECT * FROM products WHERE id=?"
    : "SELECT * FROM products";
  try {
    const result = await executeQuery(sqlSelect, [id]);
    result.map((rs) => {
      rs.image = baseUrl + rs.image;
    });
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

//update product
exports.updateProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      const id = req.body.id;
      const newProductName = req.body.name;
      if (!id) {
        res.status(500).send("Bad request: id is required...");
        return;
      }
      const sqlSelect = "SELECT * FROM products WHERE id = ?";
      const oldProduct = await executeQuery(sqlSelect, [id]);

      fs.unlink(publicUploads + oldProduct[0].image, (err) => console.log(err));
      const oldProductsImage = oldProduct[0].image;
      const newProductImage = req.file ? req.file.filename : oldProductsImage;

      const updatedProduct = {
        name: newProductName,
        image: newProductImage,
      };

      const sqlUpdate = "UPDATE products SET ? WHERE id = ?";
      await executeQuery(sqlUpdate, [updatedProduct, id]);

      const products = await executeQuery("SELECT * FROM products");
      products.map((rs) => {
        rs.image = baseUrl + rs.image;
      });
      res.send(products);
    });
  } catch (err) {
    console.log(err);
  }
};

//delete product
exports.deleteProduct = async (req, res) => {
  const ids = req.body.ids;
  if (!ids || ids.length === 0) {
    res.status(400).send("Bad request: ids reduired");
    return;
  }
  try {
    const result = await executeQuery(
      "SELECT * FROM products WHERE id IN (?)",
      [ids]
    );

    result.map((rs) => {
      fs.unlink(publicUploads + rs.image, (err) => {});
    });

    await executeQuery("DELETE FROM products WHERE id IN (?)", [ids]);
    const products = await executeQuery("SELECT * FROM products");
    products.map((rs) => {
      rs.image = baseUrl + rs.image;
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server errror");
  }
};
