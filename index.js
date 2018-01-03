//DF V2 only 
'use strict';
const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.queryResult) {
    processV2Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

function processV2Request (request, response) {
  let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default';
  let parameters = request.body.queryResult.parameters || {}; // https://dialogflow.com/docs/actions-and-parameters
  let inputContexts = request.body.queryResult.contexts; // https://dialogflow.com/docs/contexts
  let requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.source : undefined;
  let session = (request.body.session) ? request.body.session : undefined;

  const actionHandlers = {
    'policy': () => {
      
      //defined DF entity 'policytype' = life, travel, or home.
      //The policy intent, will trigger the sub-menu intent using events.
      let eventName = 'policy-' + parameters.policytype;
      let responseToUser = {
        followupEventInput: { 'name': eventName, 'languageCode': 'en' }
      };
      response.json(responseToUser);  
    },
    'default': () => {
      sendResponse('default response'); 
    }
  };

  if (!actionHandlers[action]) {
    action = 'default';
  }
  actionHandlers[action]();
 
  function sendResponse (responseToUser) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
      let responseJson = {fulfillmentText: responseToUser}; // displayed response
      response.json(responseJson); // Send response to Dialogflow
    }
  }
}

