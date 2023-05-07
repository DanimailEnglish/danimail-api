import { FirestoreVideo } from "../../../../lib/firestore/video";
import type { MuxWebhookEvent } from "../../../../types";

/**
 * Handle video.asset.created event
 * @param {MuxWebhookAssetEvent} event
 */
export async function handleAssetCreatedEvent(event: MuxWebhookEvent) {
  if (event.type !== "video.asset.created") {
    throw new Error("Incorrect event type passed to handler");
  }

  const videoId = event.data.passthrough;
  if (videoId != null) {
    const video = await FirestoreVideo.get(videoId);
    if (video?.data()?.status === "UPLOADING") {
      FirestoreVideo.update(videoId, {
        status: "PROCESSING",
        muxAssetId: event.data.id,
      });
    }
  }
}

/**
 * Handle video.asset.errored event
 * @param {MuxWebhookAssetEvent} event
 */
export async function handleAssetErroredEvent(event: MuxWebhookEvent) {
  if (event.type !== "video.asset.errored") {
    throw new Error("Incorrect event type passed to handler");
  }

  const videoId = event.data.passthrough;
  if (videoId != null) {
    FirestoreVideo.update(videoId, {
      status: "PROCESSING_ERROR",
      muxAssetId: event.data.id,
      error: event.data.errors?.messages.join(" | "),
    });
  }
}

/**
 * Handle video.asset.ready event
 * @param {MuxWebhookAssetEvent} event
 */
export async function handleAssetReadyEvent(event: MuxWebhookEvent) {
  if (event.type !== "video.asset.ready") {
    throw new Error("Incorrect event type passed to handler");
  }

  const videoId = event.data.passthrough;
  if (videoId != null) {
    const playbackId = event.data.playback_ids?.[0]?.id;
    const playbackUrl =
      playbackId && `https://stream.mux.com/${playbackId}.m3u8`;

    FirestoreVideo.update(videoId, {
      status: "READY",
      muxAssetId: event.data.id,
      playbackUrl,
    });
  }
}

/**
 * Handle video.upload.errored event
 * @param {MuxWebhookUploadEvent} event
 */
export async function handleUploadErroredEvent(event: MuxWebhookEvent) {
  if (event.type !== "video.upload.errored") {
    throw new Error("Incorrect event type passed to handler");
  }

  const videoId = event.data.new_asset_settings.passthrough;
  if (videoId != null) {
    FirestoreVideo.update(videoId, {
      status: "UPLOADING_ERROR",
      error: event.data.error?.message,
    });
  }
}
