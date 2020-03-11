const express = require("express");
const {eventQuery, textQuery} = require("../chatbot/chatbot");

const router = express.Router();

router.post("/api/df_text_query", async (req, res) => {
  const responses = await textQuery(req.body.text, req.body.parameters);
  res.send(responses[0].queryResult);
});

router.post("/api/df_event_query", async (req, res) => {
    const responses = await eventQuery(req.body.event, req.body.parameters);
    res.send(responses[0].queryResult);
});

module.exports = router;
