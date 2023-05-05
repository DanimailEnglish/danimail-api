// https://docs.mux.com/webhook-reference#video.asset.created

import type { Asset, Upload } from "@mux/mux-node";

export interface MuxWebhookAssetEvent {
  type:
    | "video.asset.created"
    | "video.asset.ready"
    | "video.asset.errored"
    | "video.asset.updated"
    | "video.asset.deleted";
  data: Asset;
}

export interface MuxWebhookUploadEvent {
  type:
    | "video.upload.asset_created"
    | "video.upload.cancelled"
    | "video.upload.created"
    | "video.upload.errored";
  data: Upload;
}

export type MuxWebhookEvent = MuxWebhookAssetEvent | MuxWebhookUploadEvent;
