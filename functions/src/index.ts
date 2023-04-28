import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

import { FirestoreUserProtectedReadOnlyData, UserRole } from "./types";

admin.initializeApp();

export const addProtectedFieldsToNewUser = functions.auth
  .user()
  .onCreate(async (user) => {
    const data: FirestoreUserProtectedReadOnlyData = {
      createdAt: Timestamp.fromDate(new Date()),
      role: UserRole.Student,
      unusedVideos: 0,
    };

    await admin
      .firestore()
      .doc(`users/${user.uid}/protected/readOnly`)
      .set(data);
  });
