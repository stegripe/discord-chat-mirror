<h1 align="center" id="top">Discord Chat Mirror</h1>
<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/tiramitzu/discord-chat-mirror?color=5865F2">
  <img alt="Github language count" src="https://img.shields.io/github/languages/count/tiramitzu/discord-chat-mirror?color=5865F2">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/tiramitzu/discord-chat-mirror?color=5865F2">
  <img alt="Repository license" src="https://img.shields.io/github/license/tiramitzu/discord-chat-mirror?color=5865F2">
</p>

<p align="center">
  <a href="#about">About</a> &#xa0; | &#xa0; 
  <a href="#features">Features</a> &#xa0; | &#xa0;
  <a href="#technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#starting">Starting</a> &#xa0; | &#xa0;
  <a href="#license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/tiramitzu" target="_blank">Author</a>
</p>

<h4 align="center">⚠️ This project is an educational purpose only ⚠️</h4>

## About ##

Discord Chat Mirror, as the name stated, this is a tool to mirror a discord chat on specific channel to another one you wish. It uses WebSocket and Discord WebHook. 

What inspire me is, when I was bored I saw a video on YouTube about the same as this project, but the one I saw could not send files, so i decided to make one for myself, and instead of relying on one modules (selfcore), I use two (selfcore and discord.js)

&#xa0;

>**Note:** If you use your main account instead of a bot, your account could get disabled for it, because it is categorized as selfbot and I take no responsibility if anything happend to you or your account.

## Features ##

+ Support .gif profile;
+ Mirror normal message;
+ Mirror files;
+ Mirror embeds;

## Technologies ##

- [Node.JS](https://nodejs.org/en/)
- [JavaScript](https://www.javascript.com/)
- [Discord.JS](https://github.com/discordjs/discord.js)
- [Selfcore](https://github.com/ExordiumX/selfcore)

## Requirements ##

All you need are [Discord](https://discord.com), [Git](https://git-scm.com), and also [Node](https://nodejs.org/) installed, don't forget about the [Discord Application](https://discord.com/developers/applications) and create a bot (There's a lot of tutorial about how to make one, so I won't).

## Starting ##

Clone this project;
```bash
git clone https://github.com/Tiramitzu/discord-chat-mirror.git
```
Access the project you just clone in the folder and choose one of the two version;
Without selfbot;
```bash
cd discord-chat-mirror/bot-ver
```
With selfbot;
```bash
cd discord-chat-mirror/selfbot-ver
```
Rename `.env.example` to `.env`, and edit its contents;

Install all the dependencies by simply running `npm i` in the terminal;

And then run the project using `node .` or `npm start` or `node app.js`.


## License ##

This project is under the license of MIT. For more details, see the [LICENSE](LICENSE.md) file.


Made with :heart: by <a href="https://github.com/tiramitzu" target="_blank">Tiramitzu</a>

&#xa0;

<a href="#top">Back to top</a>
<hr>