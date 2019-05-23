# Pom Timer (The Pom Jester)

This is a pom timer for discord. A pomodoro is 25 minutes of focused work followed by 5 minutes of break. Sometimes there are 15 minute breaks for every four done, but this timer just does 25 and 5. It responds to a !time command, opens an embed that serves as the timer, reacts to it with the green checkmark, then when the timer is finished, it sends a message to the channel it was summoned from, @ mentioning all who joined by reacting with the green checkmark. The bot deletes the finished embed timer. If there are people in the queue for the next pom, it starts a new timer.

## Getting Started

### Installing

1. Install Node and Discord.js
2. Clone this repo
3. Use the terminal command ```cd pombot``` to get into the right directory
3. Create a file called config.json
4. Copy this into the file
```
   {
    "token":"yourToken"
    "timerchannelID": ""
   }
```
5. Replace yourToken with your bot token. To get a bot token, go to the [discord developer portal](https://discordapp.com/developers/applications), then, create a new application, click create bot user and copy the token. Do not share your token - it's a password.

5a. Optional: replace timerchannelID's empty string with the channel id. It will post the actual timer to that channel instead of the one it was summoned from. To get a channel id, go into discord options, then settings, then appearance to enable developer mode. Then, right click the channel and click copy ID at the bottom of the submenu.

6. Run the bot with the command "node index.js"

Note: Anyone can start a timer by default.

## Built With

* [discordjs](https://discord.js.org/#/) - The bot framework

## Acknowledgments

* https://charat.me/profile/ - for making Pom Jester's icon
* https://leovoel.github.io/embed-visualizer/ - for planning out embed format in discord
* https://gist.github.com/PurpleBooth/109311bb0361f32d87a2#file-readme-template-md - for the readme looking swell
