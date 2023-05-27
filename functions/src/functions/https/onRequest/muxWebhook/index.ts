import Mux from "@mux/mux-node";

import { muxWebhookSecret } from "../../../../config";
import type { HttpsOnRequestHandler, MuxWebhookEvent } from "../../../../types";
import {
  handleAssetCreatedEvent,
  handleAssetErroredEvent,
  handleAssetReadyEvent,
  handleUploadErroredEvent,
} from "./eventHandlers";

const EVENT_HANDLER_MAP: {
  [EventName in MuxWebhookEvent["type"]]?: (
    event: MuxWebhookEvent
  ) => Promise<void> | void;
} = {
  "video.asset.created": handleAssetCreatedEvent,
  "video.asset.errored": handleAssetErroredEvent,
  "video.asset.ready": handleAssetReadyEvent,
  "video.upload.errored": handleUploadErroredEvent,
};

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

  const eventHandler = EVENT_HANDLER_MAP[event.type];
  if (eventHandler != null) {
    await eventHandler(event);
  }

  response.sendStatus(200);
};

export default muxWebhookHandler;
