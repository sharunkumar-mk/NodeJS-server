require("dotenv").config();
const verifyToken = require("./authentication/token_auth.js");
const jwtLogin = require("./authentication/jwt_login.js");
const {
  createModel,
  deleteModel,
  getModel,
} = require("./config/model_config.js");

const {
  postService,
  getService,
  putService,
  deleteService,
} = require("./services/api_services.js");
const models = require("./models/index.js");
const readSchema = require("./utils/read_schema.js");
const {
  postMedia,
  getMedia,
  deleteMedia,
  updateMedia,
} = require("./config/media_config.js");
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

//core api calls
app.post("/api/auth/login", jwtLogin);

app.get("/api/models", getModel);
app.post("/api/models", createModel);
app.delete("/api/models", deleteModel);

app.post("/api/media", postMedia);
app.get("/api/media", getMedia);
app.delete("/api/media", deleteMedia);
app.put("/api/media", updateMedia);

//generate dynamic model api calls
function generateModelEndpoint(model) {
  app.post(
    `/api/${model.name}`,
    verifyToken,
    postService(readSchema(model.schemaPath))
  );
  app.get(
    `/api/${model.name}`,
    verifyToken,
    getService(readSchema(model.schemaPath))
  );
  app.put(
    `/api/${model.name}`,
    verifyToken,
    putService(readSchema(model.schemaPath))
  );
  app.delete(
    `/api/${model.name}`,

    deleteService(readSchema(model.schemaPath))
  );
}
models.forEach((model) => generateModelEndpoint(model));
