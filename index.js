const {token} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();


bot.on('ready', () => {
    console.log("ready!");
});

function Confirmmsg(){
    console.log("done!");
}

bot.on('message', (msg) => {

    //checks for hello command and responds with "world!"
    if (msg.content == "hello"){
        msg.reply("world!");
        msg.edit('This is my new content!')
            .then(msg => console.log(`New message content: ${msg}`))
            .catch(console.error);
    }

    if (msg.content == "starttime"){
        setTimeout(Confirmmsg, 3000);
    }
});

bot.login(token);

