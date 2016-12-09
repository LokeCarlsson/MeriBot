//const SlackBot = require('slackbots');
const Botkit = require('botkit');

// const params = {
//     icon_emoji: ':tophat:'
// };
//
// // create a bot
// const bot = new SlackBot({
//     token: 'xoxb-114859375749-bnKWBar9ZMSk1dw4dzB4vqy7', // Add a bot https://my.slack.com/services/new/bot and put the token
//     name: 'Botboy'
// });
//
//
//
// bot.on('start', function() {
//     // more information about additional params https://api.slack.com/methods/chat.postMessage
//
// });
//
// bot.getChannels();
//
// bot.on('message', function(data) {
//   if (data.type == "message") {
//     console.log(data);
//     console.log(data.user + ": " + data.text);
//   }
//
//   if (data.text && data.text.includes("<@U3CR9B1N1>")) {
//     console.log("Message to me!");
//     console.log("Channel: " + bot.getChannel("bot"));
//     console.log(data.channel + " " + data.text);
//     bot.postMessageToChannel(data.channel, data.text, params);
//   }
// });
//bot.postMessageToUser('loke', 'I can send messages!!! Wooh!', function(data) {console.log("Skickat!")});

const welcomeMessage = "Hi, I'm Botboy!\nMention me and your request, about the following:\n• *pictures*\n• *videos*\n• *sounds*";

const controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: 'xoxb-114859375749-bnKWBar9ZMSk1dw4dzB4vqy7',
}).startRTM()

// give the bot something to listen for.
controller.hears('help',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message, welcomeMessage);
});


// controller.on('direct_mention', function (bot, message) {
//   bot.reply(message, welcomeMessage);
// });

controller.hears('pictures',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.ask('What do you want to show picture of?',function(response,convo) {
      convo.say('Alright, showing pictures of: ' + response.text);
      convo.next();
    });
  })
});
