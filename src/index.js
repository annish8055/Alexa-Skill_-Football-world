'use strict';
//var https = require ('https');
var responses = require('resources/alexaResponses');
var funfact = require ('resources/facts');
var imageResponse = require ('resources/images');
var history = require ('resources/history');
var musicUrl = require ('resources/musicFiles');
var soundEffect = require ('resources/soundEffect');

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title,text, output, repromptText, img, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'SSML',
            ssml: output,
        },
        card: {
      "type": "Standard",
      "title": title,
      "text": text,
      "image": {
        "smallImageUrl": img,
        "largeImageUrl": img
      }
    },
        reprompt: {
            outputSpeech: {
                type: 'SSML',
                ssml: repromptText,
            },
        },
      "shouldEndSession":shouldEndSession
    };
}

function buildSpeechletResponseMusicEnque(title,token, output, url, previousToken, shouldEndSession) {
    return {
       	"directives": [
				{
					"type": "AudioPlayer.Play",
					"playBehavior": "ENQUEUE",
					"audioItem": {
						"stream": {
							"token": token,
							"url": url,
							"expectedPreviousToken": previousToken,
							"offsetInMilliseconds": 0
						}
					}
				}
			],
			"shouldEndSession": true
    };
}
function buildSpeechletResponseMusicPause() {
    return {
       directives: [
                {
                    type: "AudioPlayer.Stop"
                }
            ],
			"shouldEndSession": true
    };
}
 

function buildSpeechletResponseMusic(title,text, output, url, img, shouldEndSession) {
    return {
       "outputSpeech": {
				"type": "SSML",
				"ssml": output
			},
			"card": {
				"type": "Standard",
				"title": title,
				"content": text,
				 "image": {
              "smallImageUrl": "https://s3.amazonaws.com/footballimages/musicFoot.PNG",
              "largeImageUrl": "https://s3.amazonaws.com/footballimages/musicFoot.PNG"
            }
			},
			"directives": [
				{
					"type": "AudioPlayer.Play",
					"playBehavior": "REPLACE_ALL",
					"audioItem": {
						"stream": {
							"token": "0",
							"url": url,
							"offsetInMilliseconds": 0
						}
					}
				}
			],
			"shouldEndSession": true
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

 function getWelcomeResponse(launchRequest,callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    const cardTitle = 'Welcome';
     var speechOutput;
    var repromptText ;
    var text = "welcome to football world, select from football musi which sets the mood for the game or fun fact or football history ";
    var random=[
        "ahoy",
        "aloha",
        "aooga",
        "boing",
        "bonjour",
        "booya",
        "choo choo",
        "hear hear",
        "heads up",
        "hurray"
        ];
       	speechOutput='<speak><emphasis level="strong"><say-as interpret-as="interjection">'+random[Math.round(Math.random() * ((random.length - 1) - 0) + 0)]+'</say-as> </emphasis> <audio src="'+soundEffect.sound[Math.round(Math.random() * ((soundEffect.sound.length - 1) - 0) + 0)]+'"/>'+responses.responses.welcome+'</speak>';
    repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
    var img = imageResponse.Img.welcome[Math.round(Math.random() * ((imageResponse.Img.welcome.length - 1) - 0) + 0)];
     callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText,img, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = '<speak>'+responses.responses.good_bye+'</speak>';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;
    var text = responses.responsesgood_bye;

    callback({}, buildSpeechletResponse(cardTitle,text, speechOutput, null,null, shouldEndSession));
}

function getHelpResponse(req, session, callback){
     const sessionAttributes = {};
    const cardTitle = 'Help';
    const speechOutput = '<speak>'+responses.responses.help+'</speak>';
    const repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
    var img = null; //image link
    var text = responses.responses.help;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText, img, shouldEndSession));
}
//------------------------FUNCTION------------------------------
function getHistoryResponse(req, session, callback){
    var sessionAttributes = {};
     const cardTitle = 'Football History';
     var quoteNumber = Math.round(Math.random() * ((history.hist.length - 1) - 0) + 0);
    const speechOutput = '<speak>'+history.hist[quoteNumber]+'<break time="1s"/>select from music or facts or , say stop to stop the skill </speak>';
    const repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
   // var img = imageResponse.Img.general[Math.round(Math.random() * ((imageResponse.Img.general.length - 1) - 0) + 0)];
    var text = history.hist[quoteNumber];
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText, null, shouldEndSession));
}



function getMusicStarted(req, session, callback){
       const sessionAttributes = {};
    const cardTitle = 'Football Music';
    const speechOutput = '<speak> Lets get the mood set for the game</speak>';
    const url = musicUrl.music[Math.round(Math.random() * ((musicUrl.music.length - 1) - 0) + 0)];
    const shouldEndSession = false;
    var img = null; //image link
    var text = "plaing the music";
    callback(sessionAttributes,
        buildSpeechletResponseMusic(cardTitle,text, speechOutput, url, img, shouldEndSession));
 }
 
function getFunfactResponse(req, session, callback){
      var sessionAttributes = {};
     const cardTitle = 'Football Fun-Fact';
     var quoteNumber = Math.round(Math.random() * ((funfact.facts.length - 1) - 0) + 0);
    const speechOutput = '<speak>'+funfact.facts[quoteNumber]+'<break time="1s"/>say fact for more facts or select from music or history </speak>';
    const repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
    var img = imageResponse.Img.general[Math.round(Math.random() * ((imageResponse.Img.general.length - 1) - 0) + 0)];
    var text = funfact.facts[quoteNumber];
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText, img, shouldEndSession));
} 

function getFallbackResponse(req, session, callback){
      const sessionAttributes = {};
    const cardTitle = 'Confused';
    const speechOutput = '<speak>'+responses.responses.somethingElse+'</speak>';
    const repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
    var img = null; //image link
    var text = responses.responses.somethingElse;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText, img, shouldEndSession));
}

function getresume(req, session, callback){
         const sessionAttributes = {};
    const cardTitle = 'Football Music';
    const speechOutput = null;
    const url = musicUrl.music[Math.round(Math.random() * ((musicUrl.music.length - 1) - 0) + 0)];
    const shouldEndSession = false;
    var img = null; //image link
    var text = "plaing the music";
    callback(sessionAttributes,
        buildSpeechletResponseMusic(cardTitle,text, speechOutput, url, img, shouldEndSession));
}

function onPlayNearlyFinished(req, callback){
     const sessionAttributes = {};
    const cardTitle = 'Music';
    const speechOutput = '<speak> Lets get the mood set for the game</speak>';
    const url = musicUrl.music[Math.round(Math.random() * ((musicUrl.music.length - 1) - 0) + 0)];
    console.log("----previous token------",req.context.AudioPlayer.token);
    var previousToken = req.context.AudioPlayer.token;
    var token = Math.round(Math.random() * ((musicUrl.music.length - 1) - 0) + 0);
    token = token.toString();
    const shouldEndSession = false;
   // var img = null; //image link
    callback(sessionAttributes,
        buildSpeechletResponseMusicEnque(cardTitle,token, speechOutput, url, previousToken, shouldEndSession));
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);
    // Dispatch to your skill's launch.
    getWelcomeResponse(launchRequest,callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(req, session, callback) {
   // console.log(`onIntent requestId=${req.request.requestId}, sessionId=${session.sessionId}`);

console.log("---------request-------------",req);
    //const intent = req.request.intent;
    const intentName = req.request.intent.name;


    // Dispatch to your skill's intent handlers
    if (intentName === 'funFact') {
	   getFunfactResponse(req, session, callback);
    }else if (intentName === 'history') {
       getHistoryResponse(req, session, callback);
    }else if (intentName === 'music') {
       getMusicStarted(req, session, callback);
    }else if (intentName === 'somethingElse') {
       getFallbackResponse(req, session, callback);
    }else if (intentName === 'AMAZON.PauseIntent') {
        callback({},buildSpeechletResponseMusicPause());
    }else if (intentName === 'AMAZON.NextIntent') {
       getresume(req, session, callback);
    }else if (intentName === 'AMAZON.PreviousIntent') {
       getresume(req, session, callback);
    }else if (intentName === 'AMAZON.ResumeIntent') {
       getresume(req, session, callback);
    }else if (intentName === 'AMAZON.FallbackIntent') {
       getFallbackResponse(req, session, callback);
    }else if (intentName === 'AMAZON.HelpIntent') {   
        getHelpResponse(req, session, callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
    
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
       // console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);
        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.ask.skill.73902b0f-1de3-4e91-95c4-d94b32d5eb19') {
             callback('Invalid Application ID');
        }
        */
console.log("---------event-----------",event);
        if (event.session!==undefined && event.session.new) {
            
            onSessionStarted({ requestId: event.request.requestId }, event.session);
            
        }

        if (event.request.type === 'LaunchRequest') {
            console.log("------------------launch request-----------------------");
            onLaunch(event,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'AudioPlayer.PlaybackNearlyFinished') {
            onPlayNearlyFinished(event,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'System.ExceptionEncountered' && event.context.AudioPlayer.playerActivity==='STOPPED') {
            getresume(event,null,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
