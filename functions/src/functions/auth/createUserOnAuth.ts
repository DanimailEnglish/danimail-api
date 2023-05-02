import * as admin from "firebase-admin";

import { userConverter } from "../../lib/schemas/user";
import type { AuthOnCreateHandler } from "../../types";

admin.initializeApp();

const createUserOnAuthHandler: AuthOnCreateHandler = async (
  user: admin.auth.UserRecord
) => {
  await admin
    .firestore()
    .doc(`users/${user.uid}`)
    .withConverter(userConverter)
    .update({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      email: user.email,
      role: "STUDENT",
      unusedVideos: 0,
    });
};

export default createUserOnAuthHandler;
