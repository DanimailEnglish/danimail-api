import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

export const addProtectedFieldsToNewUser = functions.auth
  .user()
  .onCreate(async (user) => {
    await admin.firestore().doc(`users/${user.uid}/protected/readOnly`).set({
      createdAt: new Date(),
      role: "student",
      unusedVideos: 0,
    });
  });
