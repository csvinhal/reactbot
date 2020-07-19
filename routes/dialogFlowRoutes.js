const express = require("express");
const {  getToken, eventQuery, textQuery } = require("../chatbot/chatbot");

const router = express.Router();

router.post("/api/df_text_query", async (req, res) => {
  const responses = await textQuery(
    req.body.text,
    req.body.userID,
    req.body.parameters
  );
  res.send(responses[0].queryResult);
});

router.post("/api/df_event_query", async (req, res) => {
  const responses = await eventQuery(
    req.body.event,
    req.body.userID,
    req.body.parameters
  );
  res.send(responses[0].queryResult);
});

router.get("/api/get_client_token", async (req, res) => {
  let token = await getToken();
  res.send({ token });
});

module.exports = router;
