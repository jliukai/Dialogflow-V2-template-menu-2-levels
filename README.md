# Dialogflow, template menu, 2 levels
A great method to organize your Dialogflow Agent when the user can go into 2+ of menus at anytime. This is an example of a 2 level menu.

for example, you want to create a chatbot for your insurance company.
the navigation menu looks like this:

-welcome
-policy
--home policy
--travel policy
--life policy
-about us

The 1st level is policy, and the "follow-up" level is the 2nd level. In the Dialogflow Agent, you see that I do not use followups. Instead, the "policy" intent uses slot-filling to get the policyType(home, travel, life) parameter, send it to the webhook fulfillment, and the code writes a followupEvent to run the other intents.
The user can say "hi", "my policy", "about us", "travel policy"... at anytime. 

Scenario 1:
user says "my policy"
response: "Sure, What type of policy are you looking for? We have Travel, Home, and Life Insurance policies."
user says "travel"
response "Travel Insurance Policy...."

Scenario 2:
user says "my travel policy"
response "Travel Insurance Policy...."



How to Install:
1. Import the attached agent into www.dialogflow.com . This code only works on Dialogflow V2.
2. Add the index.js file to the Dialogflow > fulfillment page

How to Test:
TODO

