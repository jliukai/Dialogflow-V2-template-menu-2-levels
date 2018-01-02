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
  
  console.log('Headers: ', JSON.stringify(request.headers, null, 2));
  console.log('Body: ', JSON.stringify(request.body, null, 2));
  
  let my_context = 'my_context';
  let repeat = 'repeat';
  
  function welcome() { 
        try {  //after 1st time running, say this    
            let is_FirstTime = app.getContextArgument(my_context,'isFirstTime');
            
            if (is_FirstTime.value === true) {  //1st repeat
                app.ask('Hi Again. How are you?', [
                    `I did not hear any response. How are you? no input message 1`,
                    `no input reprompt message 2`,
                    `no input reprompt message 3`
                ]);
            }
        } catch (err) { //1st time running
            let param = { isFirstTime: true};
            app.setContext(my_context,100, param);
            
            app.ask('Welcome. how are you?', [
                `I did not hear any response. How are you? no input message 1`,
                `no input reprompt message 2`,
                `no input reprompt message 3`
            ]);
        }
    }

    function welcomeFallback() {
        try {   //for "mismatched input" 
            let welcomeRepeat = app.getContextArgument(repeat,'welcomeRepeat');
            console.log('welcomeRepeat', welcomeRepeat);   
            
            if(welcomeRepeat == null){
                let param = { welcomeRepeat: 1 }
                app.setContext(repeat, 1, param);
                app.ask('I dont understand 1. can you say it again?');
            }else if (welcomeRepeat.value === 1) {  //1st repeat
                let param = { welcomeRepeat: 2 }
                app.setContext(repeat, 1, param);
                app.ask('I dont understand 2. can you say it again?');
            } else {   //2nd, last repeat, set lifespan 0 to clear.
                app.setContext(repeat, 0);
                app.ask('I dont understand 3. Goodbye.');
            }
        }catch(err){
            console.log('err: ', err);
        }
    }
    
    const actionMap = new Map();
    actionMap.set('input.welcome', welcome);
    actionMap.set('welcome.fallback', welcomeFallback);
    app.handleRequest(actionMap);

}
