import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { userUpdatableSchema, UserUpdateObject } from "../../lib/schemas/user";
import type { HttpsOnCallHandler } from "../../types";

admin.initializeApp();

const updateCurrentUserHandler: HttpsOnCallHandler = async (data, { auth }) => {
  // Validate user
  if (auth == null) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be logged in to update."
    );
  }

  // Validate data
  const validation = userUpdatableSchema.safeParse(data);
  if (!validation.success) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      validation.error.message
    );
  }

  // Convert nulls to deletes
  const updateUserData: UserUpdateObject = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Weird finagling because of Typescript
  let key: keyof typeof validation.data;
  for (key in validation.data) {
    if (Object.prototype.hasOwnProperty.call(validation.data, key)) {
      const value = validation.data[key];
      if (value === null) {
        // TODO: Find a better way to detect nullable fields that works
        // with Typescript
        if (key === "nickname" || key === "phoneNumber") {
          updateUserData[key] = admin.firestore.FieldValue.delete();
        } else {
          delete updateUserData[key];
        }
      } else {
        updateUserData[key] = value;
      }
    }
  }

  await admin.firestore().doc(`users/${auth.uid}`).update(updateUserData);
};

export default updateCurrentUserHandler;
