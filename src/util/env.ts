import * as dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN: discordToken, SERVER_ID: serverId, CHANNEL_ID: channelId, WEBHOOK_URL: webhookUrl } = process.env;

const headers = {
    "Content-Type": "application/json",
    Authorization: discordToken!
};

export { discordToken, serverId, channelId, webhookUrl, headers };
