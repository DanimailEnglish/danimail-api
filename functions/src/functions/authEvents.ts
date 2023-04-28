import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

import { firebaseAdmin } from "../lib/firebaseAdmin";
import type { FirestoreUser } from "../types";

export const createFirebaseUserOnAuth = functions.auth
  .user()
  .onCreate(async (user) => {
    const now = Timestamp.fromDate(new Date());
    const data: FirestoreUser = {
      createdAt: now,
      updatedAt: now,
      email: user.email,
      role: "STUDENT",
      unusedVideos: 0,
    };

    await firebaseAdmin.firestore().doc(`users/${user.uid}`).set(data);
  });
