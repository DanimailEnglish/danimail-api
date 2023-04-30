import type { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export type ReplaceNullWithFieldValue<T> = T extends undefined ? FieldValue : T;

export type Writable<Type> = {
  [Property in keyof Type]: ReplaceNullWithFieldValue<Type[Property]>;
};

export type ConvertTimestamps<Type, Properties extends keyof Type> = {
  [Property in keyof Type]: Property extends Properties
    ? Timestamp | FieldValue
    : Type[Property];
};

export const timestampsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Timestamps = z.infer<typeof timestampsSchema>;
