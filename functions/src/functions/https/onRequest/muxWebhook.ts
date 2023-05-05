import Mux from "@mux/mux-node";

import { muxWebhookSecret } from "../../../config";
import { FirestoreVideo } from "../../../lib/firestore/video";
import type { HttpsOnRequestHandler, MuxWebhookEvent } from "../../../types";

const muxWebhookHandler: HttpsOnRequestHandler = async (request, response) => {
  if (request.method !== "POST") {
    response.sendStatus(404);
    return;
  }

  // Validate existence mux signature header
  const muxSignature = request.header("mux-signature");
  if (muxSignature == null) {
    response.sendStatus(403);
    return;
  }

  // Validate mux signature
  try {
    Mux.Webhooks.verifyHeader(
      request.rawBody,
      muxSignature,
      muxWebhookSecret.value()
    );
  } catch {
    response.sendStatus(403);
    return;
  }

  const event = request.body as MuxWebhookEvent;

  switch (event.type) {
    case "video.asset.created": {
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
      break;
    }

    case "video.asset.errored": {
      const videoId = event.data.passthrough;
      if (videoId != null) {
        FirestoreVideo.update(videoId, {
          status: "PROCESSING_ERROR",
          muxAssetId: event.data.id,
          error: event.data.errors?.messages.join(" | "),
        });
      }
      break;
    }

    case "video.asset.ready": {
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
      break;
    }

    case "video.upload.errored": {
      const videoId = event.data.new_asset_settings.passthrough;
      if (videoId != null) {
        FirestoreVideo.update(videoId, {
          status: "UPLOADING_ERROR",
          error: event.data.error?.message,
        });
      }
      break;
    }
  }

  response.sendStatus(200);
};

export default muxWebhookHandler;
