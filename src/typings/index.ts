/* eslint-disable typescript/naming-convention */
import type { APIEmbed, Snowflake } from "discord.js";

export type Channel = {
    id: Snowflake;
    type: number;
    guild_id?: Snowflake;
    position: string;
    permission_overwrites?: Overwrite[];
    name: string;
    topic?: string;
    nsfw?: boolean;
    last_message_id?: Snowflake;
    reate_limit_per_user?: number;
    parent_id?: Snowflake;
}

export type Overwrite = {
    id: string;
    type: number;
    allow: string;
    deny: string;
}

export type Things = {
    avatarURL: string;
    content: any;
    embeds?: APIEmbed[];
    files?: any[];
    url: string;
    username: string;
}

export type WebhookConfig = {
    things: Things;
}

export type WebsocketTypes = {
    on(event: string, cb: (data: any) => void): void;
    send(data: any): void;
}

export type DiscordWebhook = {
    application_id: Snowflake | null;
    avatar: string | null;
    channel_id: Snowflake;
    guild_id: Snowflake;
    id: Snowflake;
    name: string;
    token: string;
    url: string;
}
