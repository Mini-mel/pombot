const {token} = require('./config.json');
const Eris = require('eris');
const bot = new Eris(token);

bot.on('ready', () => {
    console.log("ready!");
});

bot.on('messageCreate', (msg) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (msg.content == "!hello"){
        bot.createMessage(msg.channel.id, "world!");
    }
});

bot.connect();