const db = require("../Database/db.js");
const multer = require("multer");
const storage = require("./Multer/multer.js");
const fs = require("fs");

const upload = multer({ storage: storage }).single("image");

exports.getCategory = (req, res) => {
  const sqlSelect = "SELECT * FROM category";
  db.query(sqlSelect, (err, result) => {
    result.map((rs) => {
      rs.image = "http://127.0.0.1:3002/assets/images/category/" + rs.image;
    });
    res.send(result);
  });
};

exports.deleteCategory = (req, res) => {
  const id = req.body.id;
  console.log(id);
  const sqlDelete = "DELETE FROM category WHERE id=?";
  db.query(sqlDelete, id, (err, result) => {
    res.send(result);
    // fs.unlink(result,()=>{
    //     if (err)

    //     console.log(err)
    //     else
    //     console.log('file removed')

    // })

    if (err) console.log(err);
  });

  // console.log(url)
};

exports.updateCategory = (req, res) => {
  const newcname = req.body.categoryname;
  const cid = req.body.id;
  console.log(newcname, cid);

  const sqlUpdate = "UPDATE category SET name = ? WHERE id = ?";

  db.query(sqlUpdate, [newcname, cid]),
    (err, result) => {
      if (err) console.log(err);
    };
  x;
};

exports.addCategory = (req, res) => {
  try {
    upload(req, res, function (err) {
      // if (!req.file) {
      //   return res.send("please select an image to upload");
      // } else if (err instanceof multer.MulterError) {
      //   return res.send(err);
      // } else if (err) {
      //   return res.send(err);
      // }

      const cname = req.body.categoryname;
      console.log(cname);
      // const imagename = req.file.filename;
      //res.send(cname)

      const categoryList = {
        name: cname,
        image: "Default",
      };

      const sqlInsert = "INSERT INTO category SET ?";
      db.query(sqlInsert, categoryList, (err, result) => {
        if (err) throw err;
        res.json([
          {
            success: 1,
            category: cname,
            image: `http://127.0.0.1:3002/assets/images/category/`,
          },
        ]);
      });
    });
  } catch {}
};
