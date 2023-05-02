import * as functions from "firebase-functions";

export const updateCurrentUser = functions.https.onCall(
  async (data, context) => {
    const { default: handler } = await import(
      "./functions/https/updateCurrentUser"
    );
    handler(data, context);
  }
);

export const createUpload = functions.https.onCall(async (data, context) => {
  const { default: handler } = await import("./functions/https/createUpload");
  handler(data, context);
});

export const createUserOnAuth = functions.auth
  .user()
  .onCreate(async (user, context) => {
    const { default: handler } = await import(
      "./functions/auth/createUserOnAuth"
    );
    handler(user, context);
  });
