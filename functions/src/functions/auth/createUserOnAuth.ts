import * as admin from "firebase-admin";

import type { UserCreateObject } from "../../lib/schemas/user";
import type { AuthOnCreateHandler } from "../../types";

admin.initializeApp();

const createUserOnAuthHandler: AuthOnCreateHandler = async (
  user: admin.auth.UserRecord
) => {
  const userCreateData: UserCreateObject = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    email: user.email,
    role: "STUDENT",
    unusedVideos: 0,
  };
  await admin.firestore().doc(`users/${user.uid}`).update(userCreateData);
};

export default createUserOnAuthHandler;
