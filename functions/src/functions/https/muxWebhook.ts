import Mux from "@mux/mux-node";
import * as functions from "firebase-functions";

import { muxWebhookSecret } from "../../config";
import { FirestoreVideo } from "../../lib/firestore/video";
import type { HttpsOnRequestHandler, MuxWebhookEvent } from "../../types";

const muxWebhookHandler: HttpsOnRequestHandler = async (request, response) => {
  // Validate existence mux signature header
  const muxSignature = request.header("mux-signature");
  if (muxSignature == null) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "mux-signature header is required"
    );
  }

  // Validate mux signature
  if (
    !Mux.Webhooks.verifyHeader(
      request.rawBody,
      muxSignature,
      muxWebhookSecret.value()
    )
  ) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Mux signature verification failed"
    );
  }

  const event = request.body as MuxWebhookEvent;

  switch (event.type) {
    case "video.asset.created": {
      const videoId = event.data.passthrough;
      if (videoId != null) {
        const video = await FirestoreVideo.get(videoId);
        if (video?.data()?.status === "UPLOADING") {
          FirestoreVideo.update(videoId, { status: "PROCESSING" });
        }
      }
      break;
    }

    case "video.asset.errored": {
      const videoId = event.data.passthrough;
      if (videoId != null) {
        FirestoreVideo.update(videoId, {
          status: "PROCESSING_ERROR",
          error: event.data.errors?.messages.join(" | "),
        });
      }
      break;
    }

    case "video.asset.ready": {
      const videoId = event.data.passthrough;
      if (videoId != null) {
        FirestoreVideo.update(videoId, { status: "READY" });
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
