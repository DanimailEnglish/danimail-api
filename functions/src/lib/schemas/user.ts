import type { FirestoreDataConverter } from "firebase-admin/firestore";
import { z } from "zod";

import {
  ConvertTimestamps,
  dateStringToTimestamp,
  nullToFieldValueDelete,
  timestampsSchema,
} from "./shared";

export const userSchema = z
  .object({
    email: z.string().email().optional(),
    phoneNumber: z.string().nullable().optional(),
    firstName: z.string().min(4).max(100).optional(),
    lastName: z.string().min(4).max(100).optional(),
    nickname: z.string().min(4).max(100).nullable().optional(),
    role: z.enum(["STUDENT", "ADMIN"]),
    unusedVideos: z.number(),
  })
  .merge(timestampsSchema);

export type User = z.infer<typeof userSchema>;
export type FirebaseUser = ConvertTimestamps<User>;

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: ({ createdAt, updatedAt, nickname, phoneNumber, ...rest }) => {
    return {
      createdAt: dateStringToTimestamp(createdAt),
      updatedAt: dateStringToTimestamp(updatedAt),
      nickname: nullToFieldValueDelete(nickname),
      phoneNumber: nullToFieldValueDelete(phoneNumber),
      ...rest,
    };
  },
  fromFirestore: (userDoc): User => {
    const user = userDoc.data() as FirebaseUser;
    return {
      ...user,
      createdAt: user.createdAt.toDate().toISOString(),
      updatedAt: user.updatedAt.toDate().toISOString(),
    };
  },
};
