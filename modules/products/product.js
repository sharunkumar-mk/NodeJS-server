const db = require("../../Database/db.js");
const multer = require("multer");
const storage = require("../Multer/multer.js");
const fs = require("fs");

const upload = multer({ storage: storage }).single("product-image");

const baseUrl = `${process.env.HOST}:${process.env.PORT_NUMBER}/assets/images/`;

//get product
exports.getProduct = (req, res) => {
  const id = req.body.id;
  if (id == undefined) {
    const sqlSelect = "SELECT * FROM products";
    db.query(sqlSelect, id, (err, result) => {
      result.map((rs) => {
        rs.image = baseUrl + rs.image;
      });
      res.send(result);
    });
  } else {
    const sqlSelect = "SELECT * FROM products WHERE id=?";
    db.query(sqlSelect, id, (err, result) => {
      result.map((rs) => {
        rs.image = baseUrl + rs.image;
      });
      res.send(result);
    });
  }
};

//delete product
exports.deleteProduct = (req, res) => {
  const id = req.body.id;
  if (id == undefined) {
    res.send("id is required");
  } else {
    const sqlSelect = "SELECT image FROM products WHERE id=?";
    db.query(sqlSelect, id, (err, result) => {
      result.map((rs) => {
        const filePath = "./public/assets/images/" + rs.image;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error deleting file");
          } else {
            const sqlDelete = "DELETE FROM products WHERE id=?";
            db.query(sqlDelete, id, (err, result) => {
              if (err) throw err;

              db.query("SELECT * FROM products", (err, result) => {
                result.map((rs) => {
                  rs.image = baseUrl + rs.image;
                });
                res.send(result);
                if (err) {
                  res.send(err);
                }
              });
              if (err) console.log(err);
            });
          }
        });
      });
    });
  }
};

//update product
exports.updateProduct = (req, res) => {
  try {
    upload(req, res, function (err) {
      const productName = req.body.name;
      const id = req.body.id;
      if (!req.file) {
        const sqlUpdate = "UPDATE products SET name = ? WHERE id = ?";
        db.query(sqlUpdate, [productName, id], (err, result) => {
          if (err) throw err;
          db.query("SELECT * FROM products", (err, result) => {
            result.map((rs) => {
              rs.image = baseUrl + rs.image;
            });
            res.send(result);
            if (err) {
              res.send(err);
            }
          });
        });
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        const sqlSelect = "SELECT image FROM products WHERE id=?";
        db.query(sqlSelect, id, (err, result) => {
          if (err) throw err;
          result.map((rs) => {
            const filePath = "./public/assets/images/" + rs.image;
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          });
        });
        const productImage = req.file.filename;
        const sqlUpdate =
          "UPDATE products SET name = ?, image = ? WHERE id = ?";
        db.query(sqlUpdate, [productName, productImage, id], (err, result) => {
          if (err) throw err;
          db.query("SELECT * FROM products", (err, result) => {
            result.map((rs) => {
              rs.image = baseUrl + rs.image;
            });
            res.send(result);
            if (err) {
              res.send(err);
            }
          });
        });
      }
    });
  } catch (e) {}

  (err, result) => {
    if (err) console.log(err);
  };
};

// add new product
exports.addProduct = (req, res) => {
  try {
    upload(req, res, function (err) {
      console.log(req.file);
      if (!req.file) {
        return res.send("please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        const productName = req.body.name;
        const productImage = req.file.filename;

        const product = {
          name: productName,
          image: productImage,
        };
        const sqlInsert = "INSERT INTO products SET ?";
        db.query(sqlInsert, product, (err, result) => {
          if (err) throw err;

          db.query("SELECT * FROM products", (err, result) => {
            result.map((rs) => {
              rs.image = baseUrl + productImage;
            });
            res.send(result);
            if (err) {
              res.send(err);
            }
          });
        });
      }
    });
  } catch {}
};

// res.json([
//   {
//     success: 1,
//     category: product,
//     // image: `http://127.0.0.1:3002/assets/images/category/`,
//   },
// ]);
