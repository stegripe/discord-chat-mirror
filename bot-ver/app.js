const { WebhookClient } = require('discord.js');
const dotenv = require('dotenv');
const WebSocket = require('ws');
dotenv.config();

const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
const wsClient = new WebhookClient({
	url: process.env.WEBHOOK_URL
});

let interval = 0;
token = process.env.DISCORD_TOKEN;
payload = {
	op: 2,
	d: {
		token: token,
		intents: 513,
		properties: {
			$os: 'linux',
			$browser: 'discord.js',
			$device: 'discord.js'
		}
	}
};

ws.on('open', () => {
	ws.send(JSON.stringify(payload));
	console.log('Connected to Discord Gateway');
});

ws.on('message', (m) => {
	let payload = JSON.parse(m);
	const { t, event, op, d } = payload;

	switch (op) {
		case 10:
			const { heartbeat_interval } = d;
			interval = heartbeat(heartbeat_interval);
			break;
	}

	switch (t) {
		case 'MESSAGE_CREATE':
			if (d.channel_id !== process.env.CHANNEL_ID) return;

			let bot = ' [USER]';
			let ext = 'jpg';
			if (d.author.avatar.startsWith('a_')) ext = 'gif';
			if (d.author.bot) bot = ' [BOT]';

			let things = {
				content: d.content ? d.content : '** **',
				username: `${d.author.username}#${d.author.discriminator}${bot}`,
				avatarURL: `https://cdn.discordapp.com/avatars/${d.author.id}/${d.author.avatar}.${ext}`
			};

			if (d.embeds[0]) {
				things.embeds = [d.embeds[0]];

				wsClient.send(things);
			} else if (d.attachments[0]) {
				things.files = d.attachments.map((a) => a.url);

				wsClient.send(things);
			} else {
				wsClient.send(things);
			}
	}
});

const heartbeat = (ms) => {
	return setInterval(() => {
		ws.send(JSON.stringify({ op: 1, d: null }));
	}, ms);
};
