
import * as functions from "firebase-functions";

import { firebaseAdmin } from "../lib/firebaseAdmin";

export const createFirebaseUserOnAuth = functions.auth
  .user()
  .onCreate(async (user) => {
    await firebaseAdmin.firestore().doc(`users/${user.uid}`).update({
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      email: user.email,
      role: "STUDENT",
      unusedVideos: 0,
    });
  });
