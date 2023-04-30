import type * as functions from "firebase-functions";

export type AuthOnCreateHandler = Parameters<
  functions.auth.UserBuilder["onCreate"]
>[0];

export type HttpsOnCallHandler = Parameters<typeof functions.https.onCall>[0];
