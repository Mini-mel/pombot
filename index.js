const {token} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
var interval;
var i = 0;
var fiveminutes = 300000;   //number of miliseconds in 5 minutes
var oneminute = 60000;

function displayRemaining(sentmsg)
{
    i=i-20;
    sentmsg.edit(timerPrint());
}

function timerPrint(){
    return Math.floor(i / 60) + " Minutes " + (i % 60) + " Seconds Remaining";
}

function endTimer(sentmsg)
{
    clearInterval(interval);
    console.log("done");
    sentmsg.delete();
}

bot.on('ready', () => {
   console.log("Ready!");
   bot.user.setActivity("you succeed", {type:"WATCHING"});
});

bot.on('message', (msg) => {
    //TEST ONLY 
    fiveminutes = oneminute;

    //starts timer, then when timer ends, edits its message
    if (msg.content == "time"){
        msg.channel.send("Start!")
        //every 20s, bot edits message, 
        //and after timer is done, bot deletes its own message
        .then(sentmsg => {
            i=(fiveminutes / 1000);
            sentmsg.edit(timerPrint());
            interval = setInterval(displayRemaining.bind(null, sentmsg), 20000);
            setTimeout(endTimer.bind(null, sentmsg), fiveminutes);
        })
        .catch(error => console.log(error));
    }
});

bot.login(token);
