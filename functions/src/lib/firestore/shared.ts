import { Timestamp } from "firebase-admin/firestore";

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
