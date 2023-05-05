import { z } from "zod";

import { ConvertTimestamps, timestampsSchema } from "./shared";

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

export type UserType = z.infer<typeof userSchema>;
export type FirestoreUserType = ConvertTimestamps<UserType>;
