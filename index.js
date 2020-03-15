const express = require("express");
const bodyParser = require("body-parser");
const dialogFlow = require("./routes/dialogFlowRoutes");
const config = require("./config/keys");
const mongoose = require("mongoose");

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ hello: "there" });
});

app.use(dialogFlow);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running port ${port}`);
});
