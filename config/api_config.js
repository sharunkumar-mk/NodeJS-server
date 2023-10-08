const fs = require("fs");
const modelPath = "models/";
const db = require("../Database/db_config.js");
const util = require("util");
const models = require("../models/index.js");
const readSchema = require("../utils/read_schema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { error } = require("console");

const executeQuery = util.promisify(db.query).bind(db);

const getApis = async (req, res) => {
  const id = req.query.id;
  const apiSelect = id ? "SELECT * FROM api WHERE id= ?" : "SELECT * FROM api";
  try {
    const result = await executeQuery(apiSelect, [id]);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const getTokenList = async (req, res) => {
  const id = req.query.id;
  const selectToken = id
    ? "SELECT * FROM api_tokens WHERE id= ?"
    : "SELECT * FROM api_tokens";
  try {
    const result = await executeQuery(selectToken, [id]);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const generateApiToken = async (req, res) => {
  const apiTokenName = req.body.name;
  //   const email = req.body.email;
  //     const password = req.body.password;

  //   const retrieveUser = "SELECT * FROM admin_users WHERE email = ?";

  //   if (email == undefined || password == undefined) {
  //     res.status(401).send({ error: "Missing credentials" });
  //   } else {
  //     db.query(retrieveUser, email, (err, users) => {
  //       if (err) {
  //         console.error(err);
  //       } else {
  //         if (users[0] == undefined) {
  //           res.status(401).send({ error: "User not found" });
  //         } else {
  //           bcrypt.compare(password, users[0].password, (err, result) => {
  //             if (err) {
  //               console.error(err);
  //             } else if (result) {
  //               const user = {
  //                 id: users[0].id,
  //                 name: users[0].name,
  //                 email: users[0].email,
  //                 role: users[0].role,
  //                 status: users[0].status,
  //               };

  try {
    const tokenInsert = "INSERT INTO api_tokens SET ?";
    const accessToken = jwt.sign({}, "apiToken", { expiresIn: 60000 });
    const tokenDetails = {
      name: apiTokenName,
      token: accessToken,
    };
    await executeQuery(tokenInsert, tokenDetails);

    res.status(200).send({ token: accessToken });
  } catch (error) {
    console.log(error);
  }

  //             } else {
  //               res.status(401).send({ error: "Incorrect email or password" });
  //             }
  //           });
  //         }
  //       }
  //     });
  //   }
  // };
};

const verifyApiToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader == undefined) {
    res.status(401).send({ error: "Token required" });
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "apiToken", (err, decoded) => {
      if (err) {
        res.status(401).send({ error: "Authentication failed" });
      } else {
        next();
      }
    });
  }
};
module.exports = {
  getApis,
  generateApiToken,
  verifyApiToken,
  getTokenList,
};
