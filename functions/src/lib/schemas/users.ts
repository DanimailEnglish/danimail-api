import { z } from "zod";

import { ConvertTimestamps, timestampsSchema, Writable } from "./shared";

export const userUpdatableSchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().nullable().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  nickname: z.string().min(4).nullable().optional(),
});

export const userSchema = z
  .object({
    role: z.enum(["STUDENT", "ADMIN"]),
    unusedVideos: z.number(),
  })
  .merge(userUpdatableSchema)
  .merge(timestampsSchema);

export type UserUpdateJSON = z.infer<typeof userUpdatableSchema>;
export type UserJSON = z.infer<typeof userSchema>;

export type UserCreateObject = Writable<
  ConvertTimestamps<UserJSON, "createdAt" | "updatedAt">
>;
export type UserUpdateObject = Writable<
  Partial<ConvertTimestamps<UserJSON, "createdAt" | "updatedAt">>
>;
