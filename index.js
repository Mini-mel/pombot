const {token} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log("ready!");
});

bot.on('message', (msg) => {
    //checks for hello command and responds with "world!"
    if (msg.content == "!hello"){
        msg.reply("world!");
    }
});

bot.login(token);

