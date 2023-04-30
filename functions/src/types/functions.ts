import type * as admin from "firebase-admin/auth";
import type * as functions from "firebase-functions";

export type AuthOnCreateHandler = (
  user: admin.UserRecord,
  context: functions.EventContext
) => PromiseLike<unknown> | unknown;

export type HttpsOnCallHandler = (
  data: unknown,
  context: functions.https.CallableContext
) => unknown;
