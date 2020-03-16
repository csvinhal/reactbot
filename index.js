const express = require("express");
const bodyParser = require("body-parser");
const dialogFlow = require("./routes/dialogFlowRoutes");
const fulfillment = require("./routes/fulfillmentRoutes");
const config = require("./config/keys");
const mongoose = require("mongoose");

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const app = express();
app.use(bodyParser.json());

app.use(dialogFlow);
app.use(fulfillment);

if (process.env.NODE_ENV === "production") {
  // js and css files
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port);
