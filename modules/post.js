const db = require("../Database/db.js");
const multer = require("multer");
const imageStorage = require("./Multer/multer.js");
const fs = require("fs");
require("dotenv").config();

const upload = multer({ storage: imageStorage }).single("postImage");

exports.getPost = (req, res) => {
  const sqlSelect = "SELECT * FROM post_table";
  db.query(sqlSelect, (err, result) => {
    result.map((rs) => {
      rs.post_thumbnail =
        "http://127.0.0.1:3002/assets/images/posts/" + rs.post_thumbnail;
    });
    res.send(result);
  });
};

exports.deletePost = (req, res) => {
  const postId = req.body.postId;
  console.log(postId);
  const sqlDelete = "DELETE FROM post_table WHERE post_id=?";
  db.query(sqlDelete, postId, (err, result) => {
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

exports.updatePost = (req, res) => {
  const newcname = req.body.categoryname;
  const cid = req.body.id;
  console.log(newcname, cid);

  const sqlUpdate = "UPDATE post_table SET name = ? WHERE id = ?";

  db.query(sqlUpdate, [newcname, cid]),
    (err, result) => {
      if (err) console.log(err);
    };
  x;
};

exports.addPost = (req, res) => {
  console.log(req.file);

  try {
    upload(req, res, function (err) {
      if (!req.file) {
        return res.send("please select an image ");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      const postTitle = req.body.postTitle;
      const postContent = req.body.postContent;
      const postImage = req.file.filename;

      //res.send(cname)

      const post = {
        post_title: postTitle,
        post_content: postContent,
        post_thumbnail: postImage,
      };

      const sqlInsert = "INSERT INTO post_table SET ?";
      db.query(sqlInsert, post, (err, result) => {
        if (err) throw err;
        res.json([
          {
            success: 1,
            category: postTitle,
            image: `${process.env.HOST}:${process.env.PORT_NUMBER}/assets/images/posts/${postImage}`,
          },
        ]);
      });
    });
  } catch {}
};
