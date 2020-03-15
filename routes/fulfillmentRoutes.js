const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const Demand = require("../models/Demand");
const Coupon = require("../models/Coupon");

const router = express.Router();

router.post("/", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  const snoopy = agent => {
    agent.add(`Welcome to my Snoopy fulfillment!`);
  };

  const learn = async agent => {
    Demand.findOne({ course: agent.parameters.course }, (err, course) => {
      if (course) {
        course.counter++;
        course.save();
      } else {
        const demand = new Demand({ course: agent.parameters.course });
        demand.save();
      }
    });

    let responseText = `You want to learn about ${agent.parameters.course}. 
                    Here is a link to all of my courses: https://www.udemy.com/user/jana-bergant`;

    let coupon = await Coupon.findOne({ course: agent.parameters.course.toLowerCase() });

    if (coupon) {
      responseText = `You want to learn about ${agent.parameters.course}. 
                Here is a link to the course: ${coupon.link}`;
    }
    agent.add(responseText);
  };

  const fallback = agent => {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  };

  let intentMap = new Map();

  intentMap.set("snoopy", snoopy);
  intentMap.set("learn courses", learn);
  intentMap.set("Default Fallback Intent", fallback);

  agent.handleRequest(intentMap);
});

module.exports = router;
