const db = require("../Database/db.js");
const jwt = require("jsonwebtoken");

exports.jwtLogin = (req, res) => {
  if (req.body.email == undefined || req.body.password == undefined) {
    res.status(500).send({ error: "missing credentials" });
  } else {
    const email = req.body.email;
    const password = req.body.password;

    const LoginQuery = "SELECT * FROM users WHERE email = ? AND password = ? ";

    db.query(LoginQuery, [email, password], (err, result) => {
      if (err || result.length == 0) {
        res.status(500).send({ error: "login failed" });
      } else {
        // console.log('success')
        // res.status(200).send({success:'login success'})
        const response = {
          id: result[0].id,
          email: result[0].email,
          role: result[0].role,
          userimage: result[0].userimage,
        };
        // const response = {
        //   message: "Login succcess",
        // };
        const accessToken = jwt.sign(response, "skey", { expiresIn: 600000 });

        res.status(200).send(
          {
            accessToken: accessToken,
            user: {
              id: result[0].id,
              email: result[0].email,
              avatar: result[0].userimage,
            },
          }

          // user = {
          //   id: result[0].id,
          //   email: result[0].email,
          //   avatar: result[0].userimage,
          // }
        );
      }
    });
  }
};
