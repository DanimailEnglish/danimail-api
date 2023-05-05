import { defineString } from "firebase-functions/params";

export const muxTokenId = defineString("MUX_TOKEN_ID");
export const muxTokenSecret = defineString("MUX_TOKEN_SECRET");
export const muxWebhookSecret = defineString("MUX_WEBHOOK_SECRET");
