const {token} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
var interval;
var i = 0;

function displayRemaining(sentmsg)
{
    sentmsg.edit(i);
    i=i+1;
}

function endTimer(sentmsg)
{
    clearInterval(interval);
    console.log("done");
    sentmsg.delete();
}

bot.on('ready', () => {
   console.log("Ready!");
});

bot.on('message', (msg) => {

    //checks for hello command and responds with "world!"
    if (msg.content == "hello"){
        msg.reply("world!");
    }

    if (msg.content == "loop"){
        msg.channel.send("init")
        .then(sentmsg => {
            interval = setInterval(function(){
                sentmsg.edit("new")
            }, 1 * 10);
        })
        .catch(error => console.log(error));
    }

    //starts timer, then when timer ends, edits its message
    if (msg.content == "time"){
        msg.channel.send("Start!")
        //every 1s, bot edits message, 
        //and after 7000 ms, bot deletes its own message
        .then(sentmsg => {
            interval = setInterval(displayRemaining.bind(null, sentmsg), 1 * 1000);
            setTimeout(endTimer.bind(null, sentmsg), 7000);
        })
        .catch(error => console.log(error));
    }
});

bot.login(token);

