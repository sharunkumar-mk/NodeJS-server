const db = require("../Database/db_config.js");
const jwt = require("jsonwebtoken");

module.exports = jwtLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const LoginQuery =
    "SELECT * FROM admin_users WHERE email = ? AND password = ? ";

  if (email == undefined || password == undefined) {
    res.status(401).send({ error: "Missing credentials" });
  } else {
    db.query(LoginQuery, [email, password], (err, result) => {
      console.log(result);

      if (err || result.length == 0) {
        res.status(401).send({ error: "Incorrect email or password" });
      } else {
        const user = {
          id: result[0].id,
          email: result[0].email,
        };

        const accessToken = jwt.sign(user, "SKEY", { expiresIn: 600000 });
        res.status(200).send({
          accessToken: accessToken,
          user: {
            id: result[0].id,
            email: result[0].email,
            name: `${result[0].fistname}`,
          },
        });
      }
    });
  }
};
