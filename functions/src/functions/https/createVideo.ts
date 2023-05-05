import Mux from "@mux/mux-node";
import * as functions from "firebase-functions";
import { v4 as uuidV4 } from "uuid";

import { muxTokenId, muxTokenSecret } from "../../config";
import { FirestoreUser } from "../../lib/firestore/user";
import { FirestoreVideo } from "../../lib/firestore/video";
import { videoSchema } from "../../lib/schemas/video";
import type { HttpsOnCallHandler } from "../../types";

const { Video } = new Mux(muxTokenId.value(), muxTokenSecret.value());

export const createUploadParamsSchema = videoSchema.pick({
  recipientId: true,
  replyToVideoId: true,
});

const createVideoHandler: HttpsOnCallHandler = async (data, { auth }) => {
  // Validate user
  if (auth == null) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be logged in to update."
    );
  }

  // Validate data
  const validation = createUploadParamsSchema.safeParse(data);
  if (!validation.success) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      validation.error.message
    );
  }

  // Get firestore user data
  const user = await FirestoreUser.get(auth.uid);

  let recipientId: string;
  if (user.data()?.role === "ADMIN") {
    // If user is an admin, allow them to send videos to any user
    recipientId = validation.data.recipientId;
  } else {
    // Otherwise, force them to send to the teacher.
    const teacher = await FirestoreUser.getTeacher();
    if (teacher == null) {
      throw new functions.https.HttpsError(
        "unavailable",
        "There are no teachers registered yet."
      );
    }
    recipientId = teacher.id;
  }

  const videoId = uuidV4();

  // Create a new direct upload on Mux
  const muxUpload = await Video.Uploads.create({
    new_asset_settings: {
      playback_policy: "public",
      passthrough: videoId,
    },
  });

  // Store the new video data
  await FirestoreVideo.create(videoId, {
    senderId: auth.uid,
    recipientId,
    replyToVideoId: validation.data.replyToVideoId,
    muxUploadId: muxUpload.id,
    status: "UPLOADING",
  });
};

export default createVideoHandler;
