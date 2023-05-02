import Mux from "@mux/mux-node";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { userConverter } from "../../lib/schemas/user";
import {
  videoUploadConverter,
  videoUploadSchema,
} from "../../lib/schemas/videoUpload";
import type { HttpsOnCallHandler } from "../../types";

if (process.env.MUX_TOKEN_ID == null || process.env.MUX_TOKEN_SECRET == null) {
  throw new Error(
    "MUX_TOKEN_ID and MUX_TOKEN_SECRET environment variables are required"
  );
}
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

admin.initializeApp();

export const createUploadParamsSchema = videoUploadSchema.pick({
  recipientId: true,
  replyToVideoId: true,
});

const createUpload: HttpsOnCallHandler = async (data, { auth }) => {
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
  const firestoreUser = (
    await admin
      .firestore()
      .collection("users")
      .withConverter(userConverter)
      .doc(auth.uid)
      .get()
  ).data();

  let recipientId: string;
  if (firestoreUser?.role === "ADMIN") {
    // If user is an admin, allow them to send videos to any user
    recipientId = validation.data.recipientId;
  } else {
    // Otherwise, force them to send to the teacher. There should
    // only be one teacher for now. This code will need updates if
    // multiple teachers are possible.
    const teachers = await admin
      .firestore()
      .collection("users")
      .withConverter(userConverter)
      .where("role", "==", "ADMIN")
      .get();
    if (teachers.size === 0) {
      throw new functions.https.HttpsError(
        "unavailable",
        "There are no teachers registered yet."
      );
    }
    recipientId = teachers.docs[0].id;
  }

  // Create a new direct upload on Mux
  const upload = await Video.Uploads.create({
    new_asset_settings: {
      playback_policy: "public",
      passthrough: auth.uid,
    },
  });

  // Store the new video upload
  await admin
    .firestore()
    .collection(`users/${auth.uid}/uploads`)
    .withConverter(videoUploadConverter)
    .add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      recipientId,
      replyToVideoId: validation.data.replyToVideoId,
      muxUploadId: upload.id,
      status: upload.status,
    });
};

export default createUpload;
