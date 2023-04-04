require("dotenv").config();
const token = require("./authentication/token_auth.js");
const login = require("./authentication/jwt_login.js");
const modules = require("./config/generate_model.js");
const {
  postService,
  getService,
  putService,
} = require("./services/api_services.js");
const models = require("./models/index.js");
const readSchema = require("./utils/read_schema.js");

const express = require("express");
app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT_NUMBER, () => {
  console.log("Server running in " + process.env.PORT_NUMBER);
});

app.post("/api/auth/login", login.jwtLogin);

function generateModelEndpoint(model) {
  app.post(`/api/${model.name}`, postService(readSchema(model.schemaPath)));
  app.get(`/api/${model.name}`, getService(readSchema(model.schemaPath)));
  app.put(`/api/${model.name}`, putService(readSchema(model.schemaPath)));
}

models.forEach((model) => generateModelEndpoint(model));

// api.addProduct(app);

// app.delete("/api/products", token.verifyToken, product.deleteProduct);
// app.put("/api/products", token.verifyToken, product.updateProduct);

app.post("/api/modules", modules.generateModel);
app.delete("/api/modules", modules.deleteModel);
