import type { FirestoreDataConverter } from "firebase-admin/firestore";
import { z } from "zod";

import {
  ConvertTimestamps,
  dateStringToTimestamp,
  timestampsSchema,
} from "./shared";

export const videoUploadSchema = z
  .object({
    recipientId: z.string(),
    replyToVideoId: z.string().optional(),
    muxUploadId: z.string(),
    status: z.enum([
      "waiting",
      "asset_created",
      "errored",
      "cancelled",
      "timed_out",
    ]),
  })
  .merge(timestampsSchema);

export type VideoUpload = z.infer<typeof videoUploadSchema>;
export type FirebaseVideoUpload = ConvertTimestamps<VideoUpload>;

export const videoUploadConverter: FirestoreDataConverter<VideoUpload> = {
  toFirestore: ({ createdAt, updatedAt, ...rest }) => {
    return {
      createdAt: dateStringToTimestamp(createdAt),
      updatedAt: dateStringToTimestamp(updatedAt),
      ...rest,
    };
  },
  fromFirestore: (userDoc): VideoUpload => {
    const user = userDoc.data() as FirebaseVideoUpload;
    return {
      ...user,
      createdAt: user.createdAt.toDate().toISOString(),
      updatedAt: user.updatedAt.toDate().toISOString(),
    };
  },
};
