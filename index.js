const {token} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log("Ready!");
});

bot.on('message', (msg) => {

    //checks for hello command and responds with "world!"
    if (msg.content == "hello"){
        msg.reply("world!");
    }
    
    //starts timer, then when timer ends, edits its message
    if (msg.content == "time"){
        msg.channel.send("Start!")
            .then((msg)=>{
                setTimeout(() => function(){msg.edit("Completed!");}, 3000)
           
            }) 
            .catch(error => console.log(error));
    }

    if(msg.content == "Gui"){
        msg.channel.send("message");

    }
});

bot.login(token);

