import type {
  DocumentSnapshot,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";

import { admin } from "../../initializeFirebase";
import type { FirestoreUserType, UserType } from "../schemas/user";
import { dateStringToTimestamp } from "./shared";

export const userConverter: FirestoreDataConverter<UserType> = {
  toFirestore: ({ createdAt, updatedAt, ...rest }) => {
    return {
      createdAt: dateStringToTimestamp(createdAt),
      updatedAt: dateStringToTimestamp(updatedAt),
      ...rest,
    };
  },
  fromFirestore: (userDoc): UserType => {
    const { createdAt, updatedAt, ...rest } =
      userDoc.data() as FirestoreUserType;
    return {
      createdAt: createdAt.toDate().toISOString(),
      updatedAt: updatedAt.toDate().toISOString(),
      ...rest,
    };
  },
};

/**
 * Get the users collection with the user data converter
 * @return {firestore.CollectionReference}
 */
function collection() {
  return admin.firestore().collection("users").withConverter(userConverter);
}

/**
 * Get a specific document from the users collection by id
 * @param {string} userId
 * @return {firestore.DocumentReference}
 */
function document(userId: string) {
  return collection().doc(userId);
}

/**
 * Get a specific user by its id
 * @param {string} userId
 * @return {Promise<UserType>}
 */
async function get(userId: string): Promise<DocumentSnapshot<UserType>> {
  return await collection().doc(userId).get();
}

/**
 * Create a user with a specific id
 * @param {string} userId
 * @param {firestore.WithFieldValue<UserType>} data
 * @return {Promise<WriteResult>}
 */
async function create(
  userId: string,
  data: admin.firestore.WithFieldValue<
    Omit<UserType, "createdAt" | "updatedAt">
  >
) {
  return collection()
    .doc(userId)
    .create({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
}

/**
 * Update a user with a specific id
 * @param {string} userId
 * @param {firestore.WithFieldValue<Partial<UserType>>} data
 * @return {Promise<WriteResult>}
 */
async function update(
  userId: string,
  data: admin.firestore.WithFieldValue<Partial<UserType>>
) {
  return collection()
    .doc(userId)
    .update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
}

/**
 * Gets a user with the admin role
 * @return {Promise<QueryDocumentSnapshot | undefined>}
 */
async function getTeacher(): Promise<
  QueryDocumentSnapshot<UserType> | undefined
> {
  const teachers = await collection().where("role", "==", "ADMIN").get();
  return teachers.docs[0];
}

export const FirestoreUser = {
  collection,
  document,
  get,
  create,
  update,
  getTeacher,
};
