import { DefinedError } from "ajv";
import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

import { firebaseAdmin } from "../lib/firebaseAdmin";
import { validateUpdateUser } from "../lib/schemas/users";

export const updateCurrentUser = functions.https.onCall((data, { auth }) => {
  if (auth == null) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be logged in to update."
    );
  }

  const isValidData = validateUpdateUser(data);
  if (!isValidData) {
    const error = validateUpdateUser.errors?.[0] as DefinedError;
    throw new functions.https.HttpsError(
      "invalid-argument",
      error.message ?? `Invalid argument: ${error.propertyName}`
    );
  }

  const now = Timestamp.fromDate(new Date());
  firebaseAdmin
    .firestore()
    .doc(`users/${auth.uid}`)
    .update({
      updatedAt: now,
      ...data,
    });
});
