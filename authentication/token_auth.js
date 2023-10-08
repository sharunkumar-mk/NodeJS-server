var jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader == undefined) {
    res.status(401).send({ error: "Token required" });
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "SKEY", (err, decoded) => {
      if (err) {
        res.status(401).send({ error: "Authentication failed" });
      } else {
        next();
      }
    });
  }
};
module.exports = {
  verifyToken,
};
