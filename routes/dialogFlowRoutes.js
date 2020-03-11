const dialogflow = require("dialogflow");
const config = require("../config/keys");
const express = require("express");

const router = express.Router();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(
  config.googleProjectId,
  config.dialogFlowSessionID
);

router.get("/api/df_text_query", (req, res) => {
  res.send({ do: "text query" });
  const requrest = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.text,
        languageCode: config.dialogFlowSessionLanguageCode
      }
    }
  };

  sessionClient
    .detectIntent(requrest)
    .then(responses => {
      console.log("Detected intent");
      const result = responses[0].queryResult;
      console.log(`Query: ${result.queryText}`);
      console.log(`Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`Intent: ${result.intent.displayName}`);
      } else {
        console.log("No intent matched.");
      }
    })
    .catch(err => {
      console.log(`ERROR: ${err}`);
    });
});

router.get("/api/df_event_query", (req, res) => {
  res.send({ do: "event query" });
});

module.exports = router;
