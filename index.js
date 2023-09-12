require("dotenv").config();
const verifyToken = require("./authentication/token_auth.js");
const jwtLogin = require("./authentication/jwt_login.js");
const {
  createModel,
  deleteModel,
  getModel,
  getModelInfo,
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
const path = require("path");

app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, "views")));

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
  app.post(`/api/${model.apiId}`, postService(readSchema(model.schemaPath)));
  app.get(
    `/api/${model.apiId}`,
    // verifyToken,
    getService(readSchema(model.schemaPath))
  );
  app.put(
    `/api/${model.apiId}`,
    verifyToken,
    putService(readSchema(model.schemaPath))
  );
  app.delete(
    `/api/${model.apiId}`,

    deleteService(readSchema(model.schemaPath))
  );
}
models.forEach((model) => generateModelEndpoint(model));

// Handle all other routes and serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(process.env.PORT_NUMBER, () => {
  console.log("Server running in " + process.env.PORT_NUMBER);
});
