module.exports = {
    apps: [
        {
            name: "discord-chat-mirror",
            script: "dist/index.js",
            env: {
                DISCORD_TOKEN: "DISCORD_TOKEN",
                CHANNELS_ID: "channelId1, channelId2, channelId3",
                WEBHOOKS_URL: "https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN",
                ENABLE_BOT_INDICATOR: "yes",
                USE_WEBHOOK_PROFILE: "no",
                DEBUG_MODE: "no",
            }
        }
    ]
};
