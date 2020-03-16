const dialogflow = require("dialogflow");
const config = require("../config/keys");
const strugjason = require("structjson");
const Registration = require("../models/Registration");

const projectID = config.googleProjectID;
const sessionID = config.dialogFlowSessionID;
const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey.replace(new RegExp("\\\\n", "g"), "\n") // Should do it to work on Heroku
};

const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });

const saveRegistration = fields => {
  const registration = new Registration({
    name: fields.name.stringValue,
    address: fields.address.stringValue,
    phone: fields.phone.stringValue,
    email: fields.email.stringValue,
    dateSent: Date.now()
  });

  try {
    registration.save();
  } catch (err) {
    console.log(err);
  }
};

const handleAction = async responses => {
  let queryResult = responses[0].queryResult;

  switch (queryResult.action) {
    case "Recommendcourses-yes":
      if (queryResult.allRequiredParamsPresent) {
        saveRegistration(queryResult.parameters.fields);
      }
      break;
  }
  return responses;
};
const textQuery = async (text, userID, parameters = {}) => {
  const sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: config.dialogFlowSessionLanguageCode
      }
    },
    queryParams: {
      payload: {
        data: parameters
      }
    }
  };
  let responses = await sessionClient.detectIntent(request);
  responses = await handleAction(responses);
  return responses;
};

const eventQuery = async (event, userID, parameters = {}) => {
  const sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        name: event,
        parameters: strugjason.jsonToStructProto(parameters),
        languageCode: config.dialogFlowSessionLanguageCode
      }
    }
  };
  let responses = await sessionClient.detectIntent(request);
  responses = await handleAction(responses);
  return responses;
};

module.exports = { textQuery, handleAction, eventQuery };
