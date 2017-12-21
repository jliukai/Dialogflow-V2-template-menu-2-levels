# Dialogflow-googleAssistant_Reprompt
If the user doesnt say anything, you can reprompt.
Reprompting is used only for Google Assistant and does not work on the Dialogflow console.



'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.result) {
    processV1Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

/*
* Function to handle v1 webhook requests from Dialogflow
*/
function processV1Request (request, response) {
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
  let requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
  const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests
  const app = new DialogflowApp({request: request, response: response});
  // Create handlers for Dialogflow actions as well as a 'default' handler
  
  
    function welcome (app) {
        
        //option 1:
        let reprompt;
        let isFinal;        
        let responses = [
            'Welcome intent 1st message. how are you?',
            'What was that?',
            'Sorry I didn\'t catch that. Could you repeat yourself?',
            `Okay let's try this again later.`
        ];

        try{
            reprompt = Number(app.getArgument('REPROMPT_COUNT').intValue) + 1;
            isFinal = app.getArgument('IS_FINAL_REPROMPT').boolValue;
        } catch (err){
            reprompt = 0;
            isFinal = false;
        }
        if ((isFinal === true) || (reprompt > 2)) {
            app.tell(responses[reprompt]);
        }else{
            app.ask(responses[reprompt]);
        }
        
        /*
        //option 2
        app.ask('Welcome intent 1st message. how are you?', [
            `What was that?`,
            `Sorry I didn\'t catch that. Could you repeat yourself?`,
            `Okay let's try this again later.`
        ]);
        */
    }
    const actionMap = new Map();
    actionMap.set('input.welcome', welcome);
    //actionMap.set(app.StandardIntents.NO_INPUT, noInput);
    app.handleRequest(actionMap);

 }
