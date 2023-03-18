const db = require("../Database/db.js");
const multer = require("multer");
const storage = require("./Multer/multer.js");
const fs = require("fs");

const upload = multer({ storage: storage }).single("image");

exports.getUser = (req, res) => {
  const sqlSelect = "SELECT * FROM user";
  db.query(sqlSelect, (err, result) => {
    // result.map((rs) => {
    //   rs.image = "http://127.0.0.1:3002/assets/images/category/" + rs.image;
    // });
    res.send(result);
  });
};

// exports.deleteCategory = (req, res) => {
//   const id = req.body.id;
//   const sqlDelete = "DELETE FROM category WHERE id=?";
//   db.query(sqlDelete, id, (err, result) => {
//     res.send("file deleted");
//     // fs.unlink(result,()=>{
//     //     if (err)

//     //     console.log(err)
//     //     else
//     //     console.log('file removed')

//     // })

//     if (err) console.log(err);
//   });

//   // console.log(url)
// };

// exports.updateCategory = (req, res) => {
//   const newcname = req.body.categoryname;
//   const cid = req.body.id;
//   console.log(newcname, cid);

//   const sqlUpdate = "UPDATE category SET name = ? WHERE id = ?";

//   db.query(sqlUpdate, [newcname, cid]),
//     (err, result) => {
//       if (err) console.log(err);
//     };
//   x;
// };

exports.addUser = (req, res) => {
  try {
    // upload(req, res, function (err) {
    //   if (!req.file) {
    //     return res.send("please select an image to upload");
    //   } else if (err instanceof multer.MulterError) {
    //     return res.send(err);
    //   } else if (err) {
    //     return res.send(err);
    //   }
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const useremail = req.body.useremail;
    //res.send(cname)
    const user = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      useremail: useremail,
    };
    const sqlInsert = "INSERT INTO user SET ?";
    db.query(sqlInsert, user, (err, result) => {
      if (err) throw err;
      res.json([
        {
          message: "User inserted",
        },
      ]);
    });
    // });
  } catch {}
};
