import { admin } from "../../../../initializeFirebase";
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
    await admin.firestore().runTransaction(async (transaction) => {
      const videoDoc = FirestoreVideo.document(videoId);
      const video = await transaction.get(videoDoc);
      if (video?.data()?.status === "UPLOADING") {
        transaction.update(videoDoc, {
          status: "PROCESSING",
          muxAssetId: event.data.id,
        });
        await FirestoreVideo.update(videoId, {});
      }
    });
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
    await FirestoreVideo.update(videoId, {
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
    await FirestoreVideo.update(videoId, {
      status: "READY",
      muxAssetId: event.data.id,
      muxPlaybackId: event.data.playback_ids?.[0]?.id,
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
    await FirestoreVideo.update(videoId, {
      status: "UPLOADING_ERROR",
      error: event.data.error?.message,
    });
  }
}
