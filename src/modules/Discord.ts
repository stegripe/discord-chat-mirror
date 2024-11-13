/* eslint-disable no-await-in-loop */
/* eslint-disable typescript/strict-boolean-expressions */
/* eslint-disable id-length */
import process from "node:process";
import { setInterval } from "node:timers";

import type { APIAttachment, APIStickerItem, GatewayReceivePayload } from "discord.js";
import { WebhookClient, GatewayDispatchEvents, GatewayOpcodes } from "discord.js";

import Websocket from "ws";

import type { DiscordWebhook, Things, WebsocketTypes } from "../typings/index.js";
import { channelsId, discordToken, webhooksUrl, enableBotIndicator, headers, useWebhookProfile } from "../utils/env.js";
import logger from "../utils/logger.js";

export const executeWebhook = async (things: Things): Promise<void> => {
    const wsClient = new WebhookClient({ url: things.url });
    await wsClient.send(things);
};

let ws: WebsocketTypes;
let resumeData = {
    sessionId: "",
    resumeGatewayUrl: "",
    seq: 0
};
let authenticated = false;

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

    if (resumeData.sessionId && resumeData.resumeGatewayUrl) {
        logger.info("Resuming session...");
        logger.debug(`Session ID: ${resumeData.sessionId}`);
        logger.debug(`Resume Gateway URL: ${resumeData.resumeGatewayUrl}`);
        logger.debug(`Sequence: ${resumeData.seq}`);

        ws = new Websocket(resumeData.resumeGatewayUrl);
        ws.send(
            JSON.stringify({
                op: 6,
                d: {
                    token: discordToken,
                    // eslint-disable-next-line typescript/naming-convention
                    session_id: resumeData.sessionId,
                    seq: resumeData.seq
                }
            })
        );
    } else {
        ws = new Websocket("wss://gateway.discord.gg/?v=10&encoding=json");
    }

    ws.on("open", () => {
        logger.info("Connected to the Discord WSS.");
    });
    ws.on("message", async (data: [any]) => {
        const payload: GatewayReceivePayload = JSON.parse(data.toString()) as GatewayReceivePayload;
        const { op, d, s, t } = payload;
        resumeData.seq = s ?? resumeData.seq;

        switch (op) {
            case GatewayOpcodes.Hello:
                logger.info("Hello event received. Starting heartbeat...");
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

                    logger.debug("Heartbeat sent.");
                }, d.heartbeat_interval);

                logger.info("Heartbeat started.");
                break;
            case GatewayOpcodes.Heartbeat:
                logger.debug("Discord requested an immediate heartbeat.");
                ws.send(
                    JSON.stringify({
                        op: 1,
                        d: s
                    })
                );
                logger.debug("Heartbeat sent.");
                break;
            case GatewayOpcodes.HeartbeatAck:
                if (!authenticated) {
                    authenticated = true;
                    ws.send(
                        JSON.stringify({
                            op: 2,
                            d: {
                                token: discordToken,
                                properties: { os: "android", browser: "dcm", device: "dcm" },
                                intents: Number("37408")
                            }
                        })
                    );
                    logger.info("Authenticating...");
                }
                break;
            case GatewayOpcodes.Dispatch:
                if (t === GatewayDispatchEvents.Ready) {
                    resumeData = {
                        sessionId: d.session_id,
                        resumeGatewayUrl: `${d.resume_gateway_url}?v=10&encoding=json`,
                        seq: s
                    };
                    logger.info(`Logged in as ${d.user.username}${d.user.discriminator && d.user.discriminator !== "0" ? `#${d.user.discriminator}` : ""}`);
                }

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

                        if (embeds[0].author) {
                            things.embeds = embeds;
                        } else if (sticker_items) {
                            things.files = sticker_items.map((a: APIStickerItem) => `https://media.discordapp.net/stickers/${a.id}.webp`);
                        } else if (attachments[0].id) {
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
            case GatewayOpcodes.Reconnect: {
                logger.info("Reconnecting...");
                listen();
                break;
            }
            case GatewayOpcodes.InvalidSession:
                logger.warning("Invalid session.");
                if (d) {
                    logger.info("Can retry, reconnecting...");
                    listen();
                } else {
                    logger.error("Cannot retry, exiting...");
                    process.exit(1);
                }
                break;
            default:
                logger.warning("Unhandled opcode:", op);
                break;
        }
    });
};
