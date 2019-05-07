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
var endtimermessage = "Time for break!";
var timerchannelid = "570375164580331520" //for test server - change as necessary


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
   bot.user.setActivity("you succeed!", {type:"WATCHING"});
});

bot.on('message', (msg) => {
    minutes = fiveseconds;

    //starts timer, then when timer ends, edits its message
    if (msg.content == "time"){
        msg.guild.channels.get(timerchannelid).send("Start!")
        //every 20s, bot edits message and after timer is done, bot deletes its own message
        //bot reacts to its own timer with a checkmark. if a user reacts to that checkmark, 
        //it mentions them when the timer is completed
        //CURRENTLY works with the last user reacting. will update.
        .then(sentmsg => {
            sentmsg.react("✅").catch(error => console.log(error));
            const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === sentmsg.author.id;
            
            sentmsg.awaitReactions(filter, {time: minutes})
            .then(collected => {
                //loop through each user and add to string
                collected.first().users.forEach(function (collecteduser){
                    if (!collecteduser.bot) {
                        endtimermessage = endtimermessage + " <@" + collecteduser.id + ">";
                    }
                });
            })
            .then(() => {
                msg.channel.send(endtimermessage);
            })
            .catch(error => console.log(error));

            i=(minutes / 1000);
            sentmsg.edit(timerPrint()); //rename timer to timerToString?
            interval = setInterval(displayRemaining.bind(null, sentmsg), refreshrate);

            setTimeout(endTimer.bind(null, sentmsg), minutes);
        })
        .catch(error => console.log(error));
    }
});

bot.login(token);
