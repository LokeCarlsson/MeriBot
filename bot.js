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

controller.hears(['hello', 'hi', 'hey'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  console.log("Hej");
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  });

  controller.storage.users.get(message.user, function(err, user) {
    if (user && user.name) {
      bot.reply(message, 'Hello ' + user.name + '!!');
    } else {
      bot.reply(message, 'Hello.');
    }
  });
});

controller.hears(['good', 'perfect', 'awesome', 'sweet'],['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: '+1',
  });
});

controller.hears(['call me (.*)', 'my name is (.*)'],['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  var name = message.match[1];
  controller.storage.users.get(message.user, function(err, user) {
    if (!user) {
      user = {
        id: message.user,
      };
    }
    user.name = name;
    controller.storage.users.save(user, function(err, id) {
      bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
    });
  });
});

controller.hears(['help'],['direct_message','direct_mention','mention'], function(bot,message) {
  bot.reply(message, welcomeMessage);
});

controller.hears(['cat'], ['direct_message', 'direct_mention', 'mention'], function(bot,message){
  bot.reply(message, {
    "attachments": [{
      "fallback": "This is supposed to be a silly cat",
      "title": "Silly cat",
      "title_link": "https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg",
      "text": "Here you have a picture of a silly cat",
      "image_url": "https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg",
      "color": "#B4DA55"
    }]
  });
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
