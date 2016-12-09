//const SlackBot = require('slackbots');
const Botkit = require('botkit');

const welcomeMessage = "Hi, I'm MeriBot!\nMention me and your request, about the following:\n• *pictures*\n• *videos*";

const controller = Botkit.slackbot({
  debug: false
});

// connect the bot to a stream of messages
controller.spawn({
  token: 'xoxb-114758030546-ManmLNxpLr0c2TH1xcLwy22w',
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
