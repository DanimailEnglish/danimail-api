import * as admin from "firebase-admin";

import type { AuthOnCreateHandler, UserCreate } from "../../types";

admin.initializeApp();

const createUserOnAuthHandler: AuthOnCreateHandler = async (
  user: admin.auth.UserRecord
) => {
  const userCreateData: UserCreate = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    email: user.email,
    role: "STUDENT",
    unusedVideos: 0,
  };
  await admin.firestore().doc(`users/${user.uid}`).update(userCreateData);
};

export default createUserOnAuthHandler;
