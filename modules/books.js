const multer = require("multer");
const db = require("../Database/db.js");
const storage = require("./Multer/multer.js");

const upload = multer({ storage: storage }).array("book", 3);

exports.addBook = (req, res) => {
  try {
    upload(req, res, (err) => {
      if (!req.files) {
        return res.send("Select books to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }

      const title = req.body.bookTitle;
      const description = req.body.bookDescription;
      const date = req.body.bookDate;

      // for (const authors of req.body.bookAuthors) {
      //   const author = authors;
      // }
      // for (const file of req.files) {
      //   const filename = file.filename;

      // }

      // console.log(req.files);

      const author = JSON.stringify(req.body.bookAuthors);

      console.log(author);

      const bookInfo = {
        book_title: title,
        book_description: description,
        book_date: date,
        // bookAuthor: author,
      };

      const sqlInsert = "INSERT INTO books SET ?";

      db.query(sqlInsert, bookInfo, (err, result) => {
        if (err) throw err;
        res.json([
          {
            result: result,
          },
        ]);
      });
    });
  } catch {}
};

exports.getBookAllbooks = (req, res) => {
  const sqlSelect = "SELECT * FROM books";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
};

exports.deleteBook = (req, res) => {
  const id = req.body.id;
  console.log(id);
  const sqlDelete = " DELETE FROM books WHERE id = ?";
  db.query(sqlDelete, id, (err, result) => {
    //  res.send('Delele book with id'+id)
    if (err) console.log(err);
  });
};
