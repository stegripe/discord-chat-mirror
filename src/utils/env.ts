import { parseEnvValue } from "./functions/parseEnvValue.js";

export const discordToken = process.env.DISCORD_TOKEN;
export const channelsId: string[] = parseEnvValue(process.env.CHANNELS_ID ?? "");
export const webhooksUrl: string[] = parseEnvValue(process.env.WEBHOOKS_URL ?? "");

export const enableBotIndicator: boolean = process.env.ENABLE_BOT_INDICATOR?.toLowerCase() === "yes";
export const useWebhookProfile: boolean = process.env.USE_WEBHOOK_PROFILE?.toLowerCase() === "yes";

export const headers = {
    "Content-Type": "application/json",
    Authorization: `Bot ${discordToken}`
};
