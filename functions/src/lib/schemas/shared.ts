import type { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const timestampsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Timestamps = z.infer<typeof timestampsSchema>;

export type ReplaceNullWithFieldValue<T> = T extends null ? FieldValue : T;

export type Writable<Type> = {
  [Property in keyof Type]: ReplaceNullWithFieldValue<Type[Property]>;
};

export type ConvertTimestamps<
  Type extends Timestamps,
  Properties extends keyof Type = "createdAt" | "updatedAt"
> = {
  [Property in keyof Type]: Property extends Properties
    ? Timestamp | FieldValue
    : Type[Property];
};
