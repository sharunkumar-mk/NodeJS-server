const category = require("./modules/category.js");
const token = require("./authentication/auth.js");
const login = require("./authentication/jwtLogin.js");
const profile = require("./modules/profile.js");
const book = require("./modules/books.js");
const user = require("./modules/users.js");
const post = require("./modules/post.js");
const product = require("./modules/products/product.js");
const auth = require("./authentication/auth.js");
require("dotenv").config();

const db = require("./Database/db.js");

const express = require("express");
const app = express();

app.use(express.static("public"));
// app.use('/assets/images', express.static('assets'));

const bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors());

const path = require("path");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/profile", token.verifyToken, profile.getProfile);
app.post("/api/auth/login", login.jwtLogin);

app.post("/book/add", book.addBook);
app.get("/books/list", book.getBookAllbooks);
app.post("/book/delete", book.deleteBook);

app.post("/category/add", category.addCategory);
app.get("/category/get", category.getCategory);
app.post("/category/delete", category.deleteCategory);
app.post("category/update", category.updateCategory);

app.post("/post/add", post.addPost);
app.get("/post/get", post.getPost);
app.post("/post/delete", post.deletePost);
// app.post("category/update", category.updateCategory);

app.post("/user/add", user.addUser);
app.get("/user/get", user.getUser);

app.get("/api/products", token.verifyToken, product.getProduct);
app.post("/api/products", token.verifyToken, product.addProduct);
app.delete("/api/products", token.verifyToken, product.deleteProduct);
app.put("/api/products", token.verifyToken, product.updateProduct);

app.listen(process.env.PORT_NUMBER, () => {
  console.log("Server running in " + process.env.PORT_NUMBER);
});
