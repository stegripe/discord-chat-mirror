<h1 align="center" id="top">Discord Chat Mirror</h1>
<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/tiramitzu/discord-chat-mirror?color=5865F2">
  <img alt="Github language count" src="https://img.shields.io/github/languages/count/tiramitzu/discord-chat-mirror?color=5865F2">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/tiramitzu/discord-chat-mirror?color=5865F2">
  <img alt="Repository license" src="https://img.shields.io/github/license/tiramitzu/discord-chat-mirror?color=5865F2">
</p>
<p align="center">
  <a href="#about">Disclaimer</a> &#xa0; | &#xa0;
  <a href="#about">About</a> &#xa0; | &#xa0; 
  <a href="#features">Features</a> &#xa0; | &#xa0;
  <a href="#technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#starting">Starting</a> &#xa0; | &#xa0;
  <a href="#license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/tiramitzu" target="_blank">Author</a>
</p>
<h4 align="center">⚠️ Disclaimer ⚠️</h4>

This script is a "[self-bot](https://support.discord.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots-)" if you use your user account instead of a bot, which is against Discord's terms of service and can result in a termination of your account. 

Remember to never share your Discord token with anyone. If you are not sure what this means, you should not be using this script.

This project is an educational purpose only. I am not responsible for any misuse or damage caused by this script.

**Use at your own risk.**

## About

Discord Chat Mirror, as the name stated, this is a tool to mirror a discord chat on specific channel to another one you wish. It uses Discord WebSocket and Discord Webhook.

What inspire me is, when I was bored I saw a video on YouTube about the same as this project, but the one I saw could not send files or images, so i decided to make one for myself. I hope you enjoy it!

## Features ##
+ Support .gif profile picture;
+ Mirror normal message(s);
+ Mirror file(s);
+ Mirror embed(s);
+ Mirror sticker(s) as an image;

## Technologies ##
The following tools were used in this project:
+ [Node.js](https://nodejs.org/en/)
+ [NPM](https://www.npmjs.com/)
+ [JavaScript](https://www.javascript.com/)
+ [TypeScript](https://www.typescriptlang.org/)
+ [DiscordJS](https://discord.js.org/#/)

## Starting ##

Clone this project;
```bash
git clone https://github.com/Tiramitzu/discord-chat-mirror.git
```
Access the script with;
```bash
cd discord-chat-mirror
```
Rename `.env.example` to `.env` and fill the value;
```bash
mv .env.example .env
```
Install dependencies;
```bash
npm install
```
or if you are using yarn
```bash
yarn
```

Run the project;
```bash
npm run build && npm run start
```
or if you are using yarn
```bash
yarn build && yarn start
```
## License ##
This project is under the license of BSD 3-Clause. For more details, see the [LICENSE](LICENSE) file.


Made with :heart: by <a href="https://github.com/tiramitzu" target="_blank">Tiramitzu</a>

&#xa0;

<a href="#top">Back to top</a>
<hr>
