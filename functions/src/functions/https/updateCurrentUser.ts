import { DefinedError } from "ajv";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { validateUpdateUser } from "../../lib/schemas/users";
import type { HttpsOnCallHandler } from "../../types";

admin.initializeApp();

const updateCurrentUserHandler: HttpsOnCallHandler = (data, { auth }) => {
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

  admin
    .firestore()
    .doc(`users/${auth.uid}`)
    .update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
};

export default updateCurrentUserHandler;
