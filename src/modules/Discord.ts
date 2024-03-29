import { WebhookClient, Client, GatewayIntentBits, GatewayReceivePayload, GatewayDispatchEvents, GatewayOpcodes } from "discord.js";
import { channelId, discordToken, headers, serverId, webhookUrl } from "../util/env.js";
import { Channel, Things, WebsocketTypes } from "../typings/index.js";
import fetch from "node-fetch";
import Websocket from "ws";
import { RawAttachmentData, RawStickerData } from "discord.js/typings/rawDataTypes.js";

export const executeWebhook = (things: Things): void => {
    const wsClient = new WebhookClient({ url: things.url });
    wsClient.send(things).catch((e: any) => console.error(e));
};

export const createChannel = async (
    name: string,
    newId: string,
    pos: number,
    parentId?: string
): Promise<Channel> => fetch(`https://discord.com/api/v10/guilds/${newId}/channels`, {
    body: JSON.stringify({
        name,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        parent_id: parentId,
        position: pos
    }),
    headers,
    method: "POST"
}).then(res => res.json()) as Promise<Channel>;

export const listen = (): void => {
    new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
        ],
        closeTimeout: 6000
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const ws: WebsocketTypes = new Websocket("wss://gateway.discord.gg/?v=10&encoding=json");
    let authenticated = false;

    ws.on("open", () => {
        console.log("Connected to the Discord API.");
    });
    ws.on("message", (data: [any]) => {
        const payload: GatewayReceivePayload = JSON.parse(data.toString());
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
                } catch (e) {
                    console.log(e);
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
                if (
                    t === GatewayDispatchEvents.MessageCreate &&
                    d.guild_id === serverId &&
                    d.channel_id === channelId
                ) {
                    let ext = "jpg";
                    let ub = " [USER]";

                    const {
                        content,
                        attachments,
                        embeds,
                        sticker_items,
                        author
                    } = d;
                    const { avatar, username, discriminator: discriminatorRaw, id } = author;
                    let discriminator: string | null = discriminatorRaw;

                    if (discriminator === "0") {
                        discriminator = null;
                    } else {
                        discriminator = `#${discriminator}`;
                    }

                    if (avatar?.startsWith("a_")) ext = "gif";
                    if (author.bot) ub = " [BOT]";

                    const things: Things = {
                        avatarURL: avatar
                            ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}`
                            : `https://cdn.discordapp.com/embed/avatars/${(BigInt(id) >> 22n) % 6n}.png`,
                        content: content ? content : "** **\n",
                        url: webhookUrl,
                        username: `${username}${discriminator ?? ""}${ub}`
                    };

                    if (embeds[0]) {
                        things.embeds = embeds;
                    } else if (sticker_items) {
                        things.files = sticker_items.map(
                            (a: RawStickerData) => `https://media.discordapp.net/stickers/${a.id}.webp`
                        );
                    } else if (attachments[0]) {
                        const fileSizeInBytes = Math.max(...attachments.map((a: RawAttachmentData) => a.size));
                        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                        if (fileSizeInMegabytes < 8) {
                            things.files = attachments.map((a: RawAttachmentData) => a.url);
                        } else {
                            things.content += attachments.map((a: RawAttachmentData) => a.url).join("\n");
                        }
                    }
                    executeWebhook(things);
                }
                break;
            default:
                break;
        }
    });
};
