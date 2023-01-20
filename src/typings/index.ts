import { APIEmbed, Snowflake } from "discord.js";

/* eslint-disable @typescript-eslint/naming-convention */
export interface Channel {
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

export interface Overwrite {
    id: string;
    type: number;
    allow: string;
    deny: string;
}

export interface Things {
    avatarURL: string;
    content: any;
    embeds?: APIEmbed[];
    files?: any[];
    url: any;
    username: string;
}

export interface WebhookConfig {
    things: Things;
}
