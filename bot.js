"use strict";
//const SlackBot = require('slackbots');
const Botkit = require('botkit');

const controller = Botkit.slackbot({
  debug: false,
  json_file_store: 'db'
});

const welcomeMessage = "Hi, I'm MeriBot!\nMention me and your request, about the following:\n• *pictures*\n• *videos*";


// connect the bot to a stream of messages
controller.spawn({
  token: process.argv[2],
}).startRTM()

// Display welcome message
controller.hears('help',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message, welcomeMessage);
});

controller.hears('pictures',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.ask('What do you want to show picture of?',function(response,convo) {
      convo.say('Alright, showing pictures of: ' + response.text);
      convo.next();
    });
  })
});

controller.hears('videos',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.ask('What do you want to show videos of?',function(response,convo) {
      convo.say('Alright, showing videos of: ' + response.text);
      convo.next();
    });
  })
});
