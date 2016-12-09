"use strict";
const Botkit = require('botkit');
const ImageVaultRequest = require('./ImageVaultRequest');

class Bot {
  constructor(token) {
    this.token = token;
    this.welcomeMessage = "Hi, I'm MeriBot!\nMention me and your request, about the following:\n• *pictures*\n• *videos*";
  }

  init() {
    const controller = Botkit.slackbot({
      debug: false,
      json_file_store: 'db'
    });

    //Connect the bot to a stream of messages
    controller.spawn({
      token: this.token,
    }).startRTM()
    this.hears(controller);
  }

  hears(controller) {
    controller.hears('help', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
      bot.reply(message, this.welcomeMessage);
    });

    controller.hears(['cat'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
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

    controller.hears('pictures', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
      bot.startConversation(message, function(err, convo) {
        convo.ask('What do you want to show picture of?', function(response, convo) {
          const target = response.text;
          convo.next();

          convo.ask("Please select size:\n• *small (240 x 160)*\n• *medium (720 x 480)* \n• *large (1280 x 720)* \n• *hd (1920 x 1280)*", function(response, convo) {
            const size = response.text
            const vault = new ImageVaultRequest(target, size);
            vault.doRequest().then(pictures => {
              bot.reply(message, {
                "attachments": [{
                  "fallback": "This is supposed to be a " + response.text,
                  "title": response.text,
                  "title_link": `${pictures[0].Url}`,
                  "text": "Here you have a picture of " + response.text,
                  "image_url": `${pictures[0].Url}`,
                  "color": "#B4DA55"
                }]
              });
              convo.next();
            }).catch(error => {
              convo.say(error.message);
              convo.next();
            })
          });
        });
      })
    });

    controller.hears('lol', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
      const vault = new ImageVaultRequest("");
      vault.doRequest().then(pictures => {
        pictures.forEach(pic => {
          bot.reply(message, pic.Url)
        })
      })
    });

    controller.hears('videos', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
      bot.startConversation(message, function(err, convo) {
        convo.ask('What do you want to show videos of?', function(response, convo) {
          convo.say('Alright, showing videos of: ' + response.text);
          convo.next();
        });
      })
    });


    /*
     * Trivial and silly stuff!
     */

    controller.hears(['hello', 'hi', 'hey'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
      console.log("Hej");
      bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
      });

      controller.storage.users.get(message.user, (err, user) => {
        if (user && user.name) {
          bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
          bot.reply(message, 'Hello.');
        }
      });
    });

    controller.hears(['good', 'perfect', 'awesome', 'sweet', 'nice'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
      bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: '+1',
      });
    });

    controller.hears(['call me (.*)', 'my name is (.*)'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
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

    controller.hears(['what is my name', 'who am i'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
      controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
          bot.reply(message, 'Your name is ' + user.name);
        } else {
          bot.startConversation(message, function(err, convo) {
          if (!err) {
            convo.say('I do not know your name yet!');
            convo.ask('What should I call you?', function(response, convo) {
              convo.ask('You want me to call you `' + response.text + '`?', [{
                pattern: 'yes',
                callback: function(response, convo) {
                  convo.next();
                }
              }, {
                  pattern: 'no',
                  callback: function(response, convo) {
                    convo.stop();
                  }
                }, {
                  default: true,
                  callback: function(response, convo) {
                    convo.repeat();
                    convo.next();
                  }
                }]);
                convo.next();
              }, {
                'key': 'nickname'
              });

              convo.on('end', function(convo) {
                if (convo.status == 'completed') {
                  bot.reply(message, 'Okey! I will update my DB...');
                  controller.storage.users.get(message.user, function(err, user) {
                    if (!user) {
                      user = {
                        id: message.user,
                      };
                    }
                    user.name = convo.extractResponse('nickname');
                    controller.storage.users.save(user, function(err, id) {
                      bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                    });
                  });
                } else {
                  bot.reply(message, 'Alright, nevermind!');
                }
              });
            }
          });
        }
      });
    });
  }
}

module.exports = Bot
