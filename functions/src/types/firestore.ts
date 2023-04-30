import type { FieldValue, Timestamp } from "firebase-admin/firestore";

type Writable<T> = {
  [Property in keyof T]: T[Property] | FieldValue;
};

export interface Timestamps {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserPublic {
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}

export interface User extends Timestamps, UserPublic {
  role: "STUDENT" | "ADMIN";
  unusedVideos: number;
}

export type UserCreate = Writable<User>;
export type UserUpdate = Writable<Partial<UserPublic>>;
