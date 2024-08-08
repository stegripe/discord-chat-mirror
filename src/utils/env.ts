import { parseEnvValue } from "./functions/parseEnvValue.js";

export const webhooksUrl: string[] = parseEnvValue(process.env.WEBHOOKS_URL ?? "");
