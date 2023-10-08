const db = require("../Database/db_config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = jwtLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const retrieveUser = "SELECT * FROM admin_users WHERE email = ?";

  if (email == undefined || password == undefined) {
    res.status(401).send({ error: "Missing credentials" });
  } else {
    db.query(retrieveUser, email, (err, users) => {
      if (err) {
        console.error(err);
      } else {
        if (users[0] == undefined) {
          res.status(401).send({ error: "User not found" });
        } else {
          bcrypt.compare(password, users[0].password, (err, result) => {
            if (err) {
              console.error(err);
            } else if (result) {
              const user = {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email,
                role: users[0].role,
                status: users[0].status,
              };

              const accessToken = jwt.sign(user, "SKEY", { expiresIn: 600000 });
              res.status(200).send({
                accessToken: accessToken,
                user: {
                  id: users[0].id,
                  email: users[0].email,
                  name: users[0].name,
                },
              });
            } else {
              res.status(401).send({ error: "Incorrect email or password" });
            }
          });
        }
      }
    });
  }
};
