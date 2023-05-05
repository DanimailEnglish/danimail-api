import "./config";

import * as functions from "firebase-functions";

// App endpoints
// These functions are called directly from frontend apps

export const updateCurrentUser = functions.https.onCall(async (...args) => {
  const { default: handler } = await import(
    "./functions/https/updateCurrentUser"
  );
  handler(...args);
});

export const createVideo = functions.https.onCall(async (...args) => {
  const { default: handler } = await import("./functions/https/createVideo");
  handler(...args);
});

// Http endpoints
// These functions can be called by any http request

export const muxWebhook = functions.https.onRequest(async (...args) => {
  const { default: handler } = await import("./functions/https/muxWebhook");
  handler(...args);
});

// Events
// These functions are triggered by events occurring within Firebase

export const createUserOnAuth = functions.auth
  .user()
  .onCreate(async (...args) => {
    const { default: handler } = await import(
      "./functions/auth/createUserOnAuth"
    );
    handler(...args);
  });
