# Dialogflow-googleAssistant_Reprompt
If the user doesnt say anything, you can reprompt. 
If the user triggers a fallback intent, you can say varying inputs.

Reprompting is used only for Google Assistant and does not work on the Dialogflow console.

How to Use:
1. Create an Agent with Dialogflow.com
2. Go to the fulfillment page, you can use this code in the inline editor.
3. For the welcome intent > Actions, set to "input.welcome". 
   Set fulfillment "use webhook".
4. Create a welcome fallback intent. For the Welcome fallback intent > Actions, set to "welcome.fallback". 
   Set fulfillment "use webhook".

How to Test:
Run in the dialogflow console or AoG simulator
1. user says "hi"
2. user says "gibberish"
2. user says "anything"
2. user says "something else"

Run in AoG simulator only
1. user says "hi"
2. press no user input button, or press enter, up to 3 times for varying messages

