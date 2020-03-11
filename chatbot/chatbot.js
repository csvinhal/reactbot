const dialogflow = require("dialogflow");
const config = require("../config/keys");
const strugjason = require("structjson");

const projectID = config.googleProjectID;
const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey.replace(new RegExp('\\\\n', '\g'), '\n')
};

const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });
const sessionPath = sessionClient.sessionPath(
  config.googleProjectID,
  config.dialogFlowSessionID
);

const handleAction = async responses => {
  return responses;
};

const textQuery = async (text, parameters = {}) => {
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

const eventQuery = async (event, parameters = {}) => {
    console.log(config.googleClientEmail);
    console.log(config.googlePrivateKey);
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
