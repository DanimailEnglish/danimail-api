import type { Timestamp } from "firebase-admin/firestore";

export interface FirestoreUserReadOnlyFields {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  email?: string;
  role: "STUDENT" | "ADMIN";
  unusedVideos: number;
}

export interface FirestoreUserWritableFields {
  firstName?: string;
  lastName?: string;
}

export interface FirestoreUser
  extends FirestoreUserReadOnlyFields,
    FirestoreUserWritableFields {}
