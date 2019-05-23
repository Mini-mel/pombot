# Pom Timer (The Pom Jester)

This is a pom timer for discord. A pomodoro is 25 minutes of focused work followed by 5 minutes of break. Sometimes there are 15 minute breaks for every four done, but this timer just does 25 and 5. It responds to a !time command, opens an embed that serves as the timer, reacts to it with the green checkmark, then when the timer is finished, it sends a message to the channel it was summoned from, @ mentioning all who joined by reacting with the green checkmark. The bot deletes the finished embed timer. If there are people in the queue for the next pom, it starts a new timer.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequesites

Node
Git
discordjs

### Installing

1. Install dependencies
2. Clone this repo
3. "cd pombot" to get into the right place
4. run the bot with the command "node index.js"

### Deployment

Here's the invite. https://discordapp.com/api/oauth2/authorize?client_id=567463917446758400&permissions=2112&scope=bot
Note: Anyone can start a timer.

## Built With

* [discordjs](https://discord.js.org/#/) - The bot framework

## Authors

* **Melody Coleman**

## Acknowledgments

* https://charat.me/profile/ - for making Pom Jester's icon
* https://leovoel.github.io/embed-visualizer/ - for planning out embed format in discord
* https://gist.github.com/PurpleBooth/109311bb0361f32d87a2#file-readme-template-md - for the readme looking swell and for that getting started statement about deployment.
