import { z } from "zod";

import { ConvertTimestamps, timestampsSchema } from "./shared";

export const videoSchema = z
  .object({
    senderId: z.string(),
    recipientId: z.string(),
    replyToVideoId: z.string().optional(),
    muxUploadId: z.string(),
    muxAssetId: z.string().optional(),
    muxPlaybackId: z.string().optional(),
    status: z.enum([
      "UPLOADING",
      "UPLOADING_ERROR",
      "PROCESSING",
      "PROCESSING_ERROR",
      "READY",
    ]),
    error: z.string().optional(),
  })
  .merge(timestampsSchema);

export type VideoType = z.infer<typeof videoSchema>;
export type FirestoreVideoType = ConvertTimestamps<VideoType>;
