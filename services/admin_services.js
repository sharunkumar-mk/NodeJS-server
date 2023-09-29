const db = require("../Database/db_config.js");
const util = require("util");
const executeQuery = util.promisify(db.query).bind(db);
const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");
const saltRounds = 10;

const addAdminUsers = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const role = req.body.role;
  const status = req.body.status;
  const password = req.body.password;
  const insertQuery = "INSERT INTO admin_users SET ?";
  const selectQuery = "SELECT * FROM admin_users";

  bycrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error(err);
    } else {
      bycrypt.hash(password, salt, (err, hashPassword) => {
        if (err) {
          console.error(err);
        } else {
          const userData = {
            name: name,
            email: email,
            role: role,
            status: status,
            password: hashPassword,
          };
          db.query(insertQuery, userData, async (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send({ error: "User register failed" });
            } else {
              try {
                const result = await executeQuery(selectQuery);
                const data = result.map((row) => {
                  const { password, ...attributes } = row;
                  return attributes;
                });
                res.send(data);
              } catch (err) {
                console.log(err);
                res.status(500).send("Internal server error");
              }
            }
          });
        }
      });
    }
  });
};

const getAdminUsers = async (req, res) => {
  const selectQuery = "SELECT * FROM admin_users";
  try {
    const result = await executeQuery(selectQuery);
    const data = result.map((row) => {
      const { password, ...attributes } = row;
      return attributes;
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const deleteAdminUsers = async (req, res) => {
  const id = req.body.id;
  const deleteQuery = "DELETE FROM admin_users WHERE id IN (?)";
  const selectQuery = "SELECT * FROM admin_users";

  try {
    await executeQuery(deleteQuery, id);
    const result = await executeQuery(selectQuery);
    const data = result.map((row) => {
      const { password, ...attributes } = row;
      return attributes;
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const updateAdminUsers = async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const name = req.body.name;
  const email = req.body.email;
  const role = req.body.role;
  const status = req.body.status;
  const password = req.body.password;

  const updateQuery = "UPDATE admin_users SET ? where id = ?";
  const selectQuery = "SELECT * FROM admin_users";

  bycrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error(err);
    } else {
      bycrypt.hash(password, salt, (err, hashPassword) => {
        if (err) {
          console.error(err);
        } else {
          const userData = {
            name: name,
            email: email,
            role: role,
            status: status,
            password: hashPassword,
          };
          db.query(updateQuery, [userData, id], async (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send({ error: "Update user failed" });
            } else {
              try {
                const result = await executeQuery(selectQuery);
                const data = result.map((row) => {
                  const { password, ...attributes } = row;
                  return attributes;
                });
                res.send(data);
              } catch (err) {
                console.log(err);
                res.status(500).send("Internal server error");
              }
            }
          });
        }
      });
    }
  });
};

module.exports = {
  addAdminUsers,
  getAdminUsers,
  deleteAdminUsers,
  updateAdminUsers,
};
