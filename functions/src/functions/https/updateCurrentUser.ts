import * as functions from "firebase-functions";

import { FirestoreUser } from "../../lib/firestore/user";
import { userSchema } from "../../lib/schemas/user";
import type { HttpsOnCallHandler } from "../../types";

export const updateCurrentUserSchema = userSchema.pick({
  // TODO: Update auth email too.
  // email: true,
  phoneNumber: true,
  firstName: true,
  lastName: true,
  nickname: true,
});

const updateCurrentUserHandler: HttpsOnCallHandler = async (data, { auth }) => {
  // Validate user
  if (auth == null) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be logged in to update."
    );
  }

  // Validate data
  const validation = updateCurrentUserSchema.safeParse(data);
  if (!validation.success) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      validation.error.message
    );
  }

  await FirestoreUser.update(auth.uid, validation.data);
};

export default updateCurrentUserHandler;
