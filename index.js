const {token} = require('./config.json');
var {timerchannelID} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
const MasterEmbed = new Discord.RichEmbed()
    .setTitle('**Pom Timer**')
    .setColor(14177041)
    .setTimestamp()
    .addField("What is a pom?",
        "A pom, pomodoro, or 🍅 is 25 minutes of focused work followed by 5 minutes of break.")
    .addField("How this works!", "Join in by clicking the ✅ below! If we're on break, you'll"
        + " be added to the next pom.")
    .addField("Why isn't the timer moving?",
        "To avoid overusing internet resources, this message only refreshes every 20 seconds," +
        " but don't worry! We'll @mention you when it's done!");

var interval;
var i = 0;
var fiveminutes = 300000;   //number of miliseconds in 5 minutes
var twentyfive = 1500000;
var refreshrate = 20000;
var minutes;
var endpommessage = "Time for break!";
var endbreakmessage = "Back to work!";
var usersthisround;
var queuefornextround;
var onBreak;
var TimerGoing;


function displayRemaining(sentmsg)
{
    i=i-(refreshrate/1000); //conversion to seconds for display
    //edits original message with time remaining
    sentmsg.edit(new Discord.RichEmbed(sentmsg.embeds[0]).setTimestamp().setDescription(timerToString()));
}

function timerToString(){
    return "```\n" + Math.floor(i / 60) + " Minutes " + (i % 60) + " Seconds Remaining" + "```";
}

function timerManager(sentmsg)
{
    //timer length converted from ms to s
    i=(minutes / 1000);

    //edits original message with initialized time remaining value
    sentmsg.edit(new Discord.RichEmbed(sentmsg.embeds[0]).setDescription(timerToString()).setThumbnail(bot.user.avatarURL));
                
    //updates timer message every =refresh rate= number of seconds with current time remaining
    interval = setInterval(displayRemaining.bind(null, sentmsg), refreshrate);
    setTimeout(() => {
        clearInterval(interval);
        sentmsg.delete();
    }, minutes);
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
        } else {
            TimerGoing = false;
        }
    })
    .catch(error => console.log(error));

}

function runPomTimer(msg){
    TimerGoing = true;
    //if config is not set up, timerchannelID is the channel commands are sent from.
    if (timerchannelID == null || timerchannelID == undefined || timerchannelID == ""){
        timerchannelID = msg.channel.id;
    } 
    msg.guild.channels.get(timerchannelID).send(MasterEmbed)
    .then(sentmsg => {
        timerManager(sentmsg);
        collectReactions(msg, sentmsg);
    })
    .catch(error => console.log(error));
}

bot.on('ready', () => {
   console.log("Ready!");
   bot.user.setActivity("you succeed!", {type:"WATCHING"});
   TimerGoing = false;
});

bot.on('message', (msg) => {
    if (msg.content == "!time"){
        if (!TimerGoing){
            usersthisround = [];
            queuefornextround = [];
            onBreak = false;
            minutes = twentyfive;
            runPomTimer(msg);
        } else {
            msg.channel.send("A timer has already been started!");
        }
    }
});

bot.login(token);
