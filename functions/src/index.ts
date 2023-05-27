import "./config";

import * as functions from "firebase-functions";

// App endpoints
// These functions are called directly from frontend apps

export const updateCurrentUser = functions.https.onCall(async (...args) => {
  const { default: handler } = await import(
    "./functions/https/onCall/updateCurrentUser"
  );
  return handler(...args);
});

export const createVideo = functions.https.onCall(async (...args) => {
  const { default: handler } = await import(
    "./functions/https/onCall/createVideo"
  );
  return handler(...args);
});

// Http endpoints
// These functions are called through direct http request

export const muxWebhook = functions.https.onRequest(async (...args) => {
  const { default: handler } = await import(
    "./functions/https/onRequest/muxWebhook"
  );
  return handler(...args);
});

// Events
// These functions are triggered by events occurring within Firebase

export const createUserOnAuth = functions.auth
  .user()
  .onCreate(async (...args) => {
    const { default: handler } = await import(
      "./functions/auth/createUserOnAuth"
    );
    return handler(...args);
  });
