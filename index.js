const {token} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

var interval;
var i = 0;
var fiveminutes = 4999 //300000;   //number of miliseconds in 5 minutes
var twentyfive = 5000 //1500000;
var refreshrate = 20000;
var minutes;
var endpommessage = "Time for break!";
var endbreakmessage = "Back to work!";
var timerchannelid = "570375164580331520" //for test server - change as necessary
var usersthisround;
var queuefornextround;
var onBreak;


function displayRemaining(sentmsg)
{
    i=i-(refreshrate/1000); //conversion to seconds for display
    sentmsg.edit(timerToString());
}

function timerToString(){
    return Math.floor(i / 60) + " Minutes " + (i % 60) + " Seconds Remaining";
}

function endTimer(sentmsg)
{
    clearInterval(interval);
    sentmsg.delete();
}

function timerManager(sentmsg)
{
    //timer length converted from ms to s
    i=(minutes / 1000);
    //edits original message with time remaining
    sentmsg.edit(timerToString());
                
    //updates timer message every =refresh rate= number of seconds with current time remaining
    interval = setInterval(displayRemaining.bind(null, sentmsg), refreshrate);
    setTimeout(endTimer.bind(null, sentmsg), minutes);
}

function addToEnd(arrayofids, endmessage){
    arrayofids.forEach(function (userid){
        endmessage = endmessage + " <@" + userid + ">";
    });
    return endmessage;
}

//---------Get users who react with checkmark and mention them when timer is over-----------
function collectReactions(msg, sentmsg){
    sentmsg.react("✅").catch(error => console.log(error));

    //collect users who react with checkmark
    const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === sentmsg.author.id;
    sentmsg.awaitReactions(filter, {time: minutes})
    .then(collected => {
        if (onBreak){
            endbreakmessage = addToEnd(usersthisround, endbreakmessage);
            endbreakmessage = addToEnd(queuefornextround, endbreakmessage);
            usersthisround = [];
            queuefornextround = [];

            collected.first().users.forEach(function (collecteduser){
                if (!collecteduser.bot) {
                    queuefornextround.push(collecteduser.id);
                }
            });
        } else {
            collected.first().users.forEach(function (collecteduser){
                //if user is not bot, mention them in the end timer message
                if (!collecteduser.bot) {
                    endpommessage = endpommessage + " <@" + collecteduser.id + ">";
                    usersthisround.push(collecteduser.id);
                }
            });
            
            endpommessage = addToEnd(queuefornextround, endpommessage);
        }
    })
    .then(() => {
        //send the end timer message in the original channel
        if (onBreak){
            msg.channel.send(endbreakmessage);
            minutes = twentyfive;
            onBreak = false;
        } else {
            msg.channel.send(endpommessage);
            minutes = fiveminutes;
            onBreak = true;
        }
    }).then(() => {
        endbreakmessage = "Back to work!";
        endpommessage = "Time for break!";
        console.log("done");
        if (!(usersthisround === undefined || usersthisround === null || usersthisround.length == 0) 
        || !(queuefornextround === undefined || queuefornextround === null || queuefornextround.length == 0)){
            runPomTimer(msg);
        }
    })
    .catch(error => console.log(error));

}

function runPomTimer(msg){
    msg.guild.channels.get(timerchannelid).send("Start!")
    .then(sentmsg => {
        timerManager(sentmsg);
        collectReactions(msg, sentmsg);
    })
    .catch(error => console.log(error));
}

bot.on('ready', () => {
   console.log("Ready!");
   bot.user.setActivity("you succeed!", {type:"WATCHING"});
});

bot.on('message', (msg) => {
    if (msg.content == "time"){
        usersthisround = [];
        queuefornextround = [];
        onBreak = false;
        minutes = twentyfive;
        runPomTimer(msg);
    }
});

bot.login(token);
