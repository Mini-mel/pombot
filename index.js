const {token} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

var interval;
var i = 0;
var fiveminutes = 300000;   //number of miliseconds in 5 minutes
var twentyfivem = 1500000;
var fiveseconds = 5000;
var refreshrate = 20000; 
var minutes;
var humans;
var endtimermessage = "Time for break!";
var timerchannelid = "570375164580331520" //for test server - change as necessary


function displayRemaining(sentmsg)
{
    i=i-20;
    sentmsg.edit(timerToString());
}

function timerToString(){
    return Math.floor(i / 60) + " Minutes " + (i % 60) + " Seconds Remaining";
}

function endTimer(sentmsg)
{
    clearInterval(interval);
    console.log("done");
    sentmsg.delete();
}

function pomtimer(msg, sentmsg)
{
    //i is the timer length converted from ms to s
    i=(minutes / 1000);
    //edits original message with time remaining
    sentmsg.edit(timerToString());
                
    //updates timer message every =refresh rate= number of seconds with current time remaining
    interval = setInterval(displayRemaining.bind(null, sentmsg), refreshrate);
    setTimeout(endTimer.bind(null, sentmsg), minutes);
}


//---------Get users who react with checkmark and mention them when timer is over-----------
function collectReactions(msg, sentmsg){
    humans = 0;
    sentmsg.react("✅").catch(error => console.log(error));
    //filter is: users reacting with checkmark
    const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === sentmsg.author.id;
    
    //wait for people to react until timer is up
    sentmsg.awaitReactions(filter, {time: minutes})
    .then(collected => {
        //loop through each participating user
        collected.first().users.forEach(function (collecteduser){
            //if user is not bot, mention them in the end timer message
            if (!collecteduser.bot) {
                endtimermessage = endtimermessage + " <@" + collecteduser.id + ">";
                humans++;
            }
        });
    })
    .then(() => {
        //send the end timer message in the original channel
        if (humans != 0){
            msg.channel.send(endtimermessage);
            runPomTimer(msg);
        }
    })
    .catch(error => console.log(error));

}
//NEXT! Mention users who were on break but didn't sign up for next one
//add embed that explains how it works (reactions and stuff)
//add embed that explains that it refreshes every 20 seconds and that it will @notify/mention you when time is up
function runPomTimer(msg){
    msg.guild.channels.get(timerchannelid).send("Start!")
    //every 20s, bot edits message and after timer is done, bot deletes its own message
    //bot reacts to its own timer with a checkmark.
    .then(sentmsg => {
        pomtimer(msg, sentmsg);
        collectReactions(msg, sentmsg);
    })
    .then(() => {
        if (minutes == twentyfivem){
            minutes = fiveminutes;
        } else {
            minutes = twentyfivem;
        };
    })
    .catch(error => console.log(error));
}

bot.on('ready', () => {
   console.log("Ready!");
   bot.user.setActivity("you succeed!", {type:"WATCHING"});
});

bot.on('message', (msg) => {

    //starts timer, then when timer ends, edits its message
    if (msg.content == "time"){
        minutes = twentyfivem;  //timer length
        runPomTimer(msg);
    }
});

bot.login(token);
