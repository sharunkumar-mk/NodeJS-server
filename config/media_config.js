const multer = require("multer");
const util = require("util");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const db = require("../Database/db_config.js");
const executeQuery = util.promisify(db.query).bind(db);
const uploadPath = "./public/uploads";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const multerMediaUpload = multer({ storage: storage }).array("media");
const multerMediaUpdate = multer({ storage: storage }).single("media");

const postMedia = (req, res) => {
  multerMediaUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    const files = req.files;
    if (files) {
      for (const file of files) {
        const fileData = {
          name: file.originalname,
          mime: file.mimetype,
          size: file.size,
          path: file.path,
          folder_path: file.destination.replace("./public", ""),
        };
        await executeQuery(`INSERT INTO files SET ?`, fileData);
      }
      res.send("Files uploaded successfully");
    } else {
      res.status(500).send("Internal server error");
    }
  });
};

//get service
const getMedia = async (req, res) => {
  const id = req.body.id;
  const sqlSelect = id
    ? `SELECT * FROM files WHERE id=?`
    : `SELECT * FROM files`;
  try {
    const result = await executeQuery(sqlSelect, [id]);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const updateMedia = (req, res) => {
  multerMediaUpdate(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    const id = req.body.id;
    const name = req.body.name;
    const file = req.file;

    if (!id) {
      res.status(400).send("Bad request");
    } else {
      try {
        const media = await executeQuery("SELECT * FROM files WHERE id = ?", [
          id,
        ]);
        if (!media) {
          return res.status(404).json({ error: "file not found" });
        }
        const filePath = `${media[0].path}`;
        await unlinkAsync(filePath);

        // update media record in database
        const updatedMedia = {
          name: name,
          path: file.path,
          mime: file.mimetype,
          size: file.size,
        };

        await executeQuery("UPDATE files SET ? WHERE id = ?", [
          updatedMedia,
          id,
        ]);

        res.json({ message: "Media updated successfully" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });
};

const deleteMedia = async (req, res) => {
  const ids = req.body.ids;
  if (!ids || ids.length === 0) {
    res.status(400).send("Bad request: ids required");
    return;
  }
  try {
    const files = await executeQuery(`SELECT * FROM files WHERE id IN (?)`, [
      ids,
    ]);
    files.forEach((file) => {
      unlinkAsync(file.path);
    });
    await executeQuery(`DELETE FROM files WHERE id IN (?)`, [ids]);
    const data = await executeQuery(`SELECT * FROM files`);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server errror");
  }
};

module.exports = {
  postMedia,
  getMedia,
  deleteMedia,
  updateMedia,
};
