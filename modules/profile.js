var jwt = require("jsonwebtoken");

exports.getProfile = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const data = jwt.decode(token);

  console.log(data.id);
  res.send({
    user: {
      id: data.id,
      email: data.email,
      role: data.role,
      avatar: data.userimage,
    },
  });
};
