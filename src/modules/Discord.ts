/* eslint-disable no-await-in-loop */
/* eslint-disable typescript/strict-boolean-expressions */
/* eslint-disable id-length */
import { setInterval } from "node:timers";

import type { APIAttachment, APIStickerItem, GatewayReceivePayload } from "discord.js";
import { WebhookClient, Client, GatewayIntentBits, GatewayDispatchEvents, GatewayOpcodes } from "discord.js";

import Websocket from "ws";

import type { DiscordWebhook, Things, WebsocketTypes } from "../typings/index.js";
import { channelsId, discordToken, webhooksUrl, enableBotIndicator, headers, useWebhookProfile } from "../utils/env.js";

export const executeWebhook = async (things: Things): Promise<void> => {
    const wsClient = new WebhookClient({ url: things.url });
    await wsClient.send(things);
};

export const listen = (): void => {
    new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
        ],
        closeTimeout: 6_000
    });

    const ws: WebsocketTypes = new Websocket("wss://gateway.discord.gg/?v=10&encoding=json");
    let authenticated = false;

    ws.on("open", () => {
        console.log("Connected to the Discord API.");
    });
    ws.on("message", async (data: [any]) => {
        const payload: GatewayReceivePayload = JSON.parse(data.toString()) as GatewayReceivePayload;
        const { op, d, s, t } = payload;

        switch (op) {
            case GatewayOpcodes.Hello:
                try {
                    ws.send(
                        JSON.stringify({
                            op: 1,
                            d: s
                        })
                    );
                    setInterval(() => {
                        ws.send(
                            JSON.stringify({
                                op: 1,
                                d: s
                            })
                        );
                    }, d.heartbeat_interval);
                } catch (error) {
                    console.log(error);
                }
                break;
            case GatewayOpcodes.HeartbeatAck:
                if (!authenticated) {
                    authenticated = true;
                    ws.send(
                        JSON.stringify({
                            op: 2,
                            d: {
                                token: discordToken,
                                properties: {
                                    $os: "linux",
                                    $browser: "test",
                                    $device: "test"
                                }
                            }
                        })
                    );
                }
                break;
            case GatewayOpcodes.Dispatch:
                if (t === GatewayDispatchEvents.MessageCreate && channelsId.includes(d.channel_id)) {
                    let ext = "jpg";
                    let ub = " [USER]";

                    const { content, attachments, embeds, sticker_items, author } = d;
                    const { avatar, username, discriminator: discriminatorRaw, id, bot } = author;
                    let discriminator: string | null = discriminatorRaw;

                    discriminator = discriminator === "0" ? null : `#${discriminator}`;

                    if (avatar?.startsWith("a_") ?? false) ext = "gif";
                    if (bot ?? false) ub = " [BOT]";

                    for (const webhookUrl of webhooksUrl) {
                        const things: Things = {
                            avatarURL:
                                avatar ?? ""
                                    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}`
                                    : `https://cdn.discordapp.com/embed/avatars/${(BigInt(id) >> 22n) % 6n}.png`,
                            content: content ?? "** **\n",
                            url: webhookUrl,
                            username: `${username}${discriminator ?? ""}${enableBotIndicator ? ub : ""}`
                        };

                        if (useWebhookProfile) {
                            const webhookData = await fetch(webhookUrl, {
                                method: "GET",
                                headers
                            });

                            const tes: DiscordWebhook = (await webhookData.json()) as DiscordWebhook;
                            let ext2 = "jpg";
                            if (tes.avatar?.startsWith("a_") ?? false) ext2 = "gif";
                            things.avatarURL = `https://cdn.discordapp.com/avatars/${tes.id}/${tes.avatar}.${ext2}`;
                            things.username = tes.name;
                        }

                        if (embeds[0]) {
                            things.embeds = embeds;
                        } else if (sticker_items) {
                            things.files = sticker_items.map(
                                (a: APIStickerItem) => `https://media.discordapp.net/stickers/${a.id}.webp`
                            );
                        } else if (attachments[0]) {
                            const fileSizeInBytes = Math.max(...attachments.map((a: APIAttachment) => a.size));
                            const fileSizeInMegabytes = fileSizeInBytes / (1_024 * 1_024);
                            if (fileSizeInMegabytes < 8) {
                                things.files = attachments.map((a: APIAttachment) => a.url);
                            } else {
                                things.content += attachments.map((a: APIAttachment) => a.url).join("\n");
                            }
                        }
                        await executeWebhook(things);
                    }
                }
                break;
            default:
                break;
        }
    });
};
