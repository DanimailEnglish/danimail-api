import type { Timestamp } from "firebase-admin/firestore";

export enum UserRole {
  Student = "STUDENT",
  Admin = "ADMIN",
}

export interface FirestoreUserData {
  firstName: string;
  lastName: string;
}

export interface FirestoreUserProtectedReadOnlyData {
  createdAt: Timestamp;
  role: UserRole;
  unusedVideos: number;
}
