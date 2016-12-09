const config = require('./config.js');
const Bot = require('./bot.js');
const token = config.token;

const bot = new Bot(config.token);
bot.init();
