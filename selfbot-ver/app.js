import selfcore from 'selfcore';
import { WebhookClient } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const wsClient = new WebhookClient({
	url: process.env.WEBHOOK_URL
});

const gateway = new selfcore.Gateway(process.env.DISCORD_TOKEN);

gateway.on('open', () => {
	console.log('Connected to Discord Gateway');
});

gateway.on('message', (m) => {
	if (m.channel_id !== process.env.CHANNEL_ID) return;

	let bot = ' [USER]';
	let ext = 'jpg';
	if (m.author.avatar.startsWith('a_')) ext = 'gif';
	if (m.author.bot) bot = ' [BOT]';

	let things = {
		content: m.content ? m.content : '** **',
		username: `${m.author.username}#${m.author.discriminator}${bot}`,
		avatarURL: `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.${ext}`
	};

	if (m.embeds[0]) {
		things.embeds = [m.embeds[0]];

		wsClient.send(things);
	} else if (m.attachments[0]) {
		things.files = m.attachments.map((a) => a.url);

		wsClient.send(things);
	} else {
		wsClient.send(things);
	}
});
