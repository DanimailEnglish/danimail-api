import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const timestampsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Timestamps = z.infer<typeof timestampsSchema>;

export type ConvertTimestamps<
  Type extends Timestamps,
  Properties extends keyof Type = "createdAt" | "updatedAt"
> = {
  [Property in keyof Type]: Property extends Properties
    ? Timestamp
    : Type[Property];
};
