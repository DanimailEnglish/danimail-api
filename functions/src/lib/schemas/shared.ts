import { FieldValue, Timestamp } from "firebase-admin/firestore";
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

/**
 * Converts a possible null value into a delete for Firestore.
 * Preserves the value otherwise.
 * @param {T | null} value
 * @return {T | FieldValue}
 */
export function nullToFieldValueDelete<T>(value: T | null): T | FieldValue {
  return value === null ? FieldValue.delete() : <T>value;
}

/**
 * Converts a possible string into a Timestamp for Firestore.
 * Preserves the value otherwise.
 * @param {T | string} dateString
 * @return {T | Timestamp}
 */
export function dateStringToTimestamp<T>(
  dateString: T | string
): T | Timestamp {
  return typeof dateString === "string"
    ? Timestamp.fromDate(new Date(dateString))
    : dateString;
}
