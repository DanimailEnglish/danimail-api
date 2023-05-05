import "../initializeApp";

import * as admin from "firebase-admin";
import type {
  DocumentSnapshot,
  FirestoreDataConverter,
} from "firebase-admin/firestore";

import { FirestoreVideoType, VideoType } from "../schemas/video";
import { dateStringToTimestamp } from "./shared";

export const videoConverter: FirestoreDataConverter<VideoType> = {
  toFirestore: ({ createdAt, updatedAt, ...rest }) => {
    return {
      createdAt: dateStringToTimestamp(createdAt),
      updatedAt: dateStringToTimestamp(updatedAt),
      ...rest,
    };
  },
  fromFirestore: (videoDoc): VideoType => {
    const { createdAt, updatedAt, ...rest } =
      videoDoc.data() as FirestoreVideoType;
    return {
      createdAt: createdAt.toDate().toISOString(),
      updatedAt: updatedAt.toDate().toISOString(),
      ...rest,
    };
  },
};

/**
 * Get the videos collection with the user data converter
 * @return {firestore.CollectionReference}
 */
function collection() {
  return admin.firestore().collection("videos").withConverter(videoConverter);
}

/**
 * Get a specific document from the videos collection by id
 * @param {string} videoId
 * @return {firestore.DocumentReference}
 */
function document(videoId: string) {
  return collection().doc(videoId);
}

/**
 * Get a specific video by its id
 * @param {string} videoId
 * @return {Promise<VideoType>}
 */
async function get(videoId: string): Promise<DocumentSnapshot<VideoType>> {
  return await collection().doc(videoId).get();
}

/**
 * Create a video with a specific id
 * @param {string} videoId
 * @param {firestore.WithFieldValue<VideoType>} data
 * @return {Promise<WriteResult>}
 */
async function create(
  videoId: string,
  data: admin.firestore.WithFieldValue<
    Omit<VideoType, "createdAt" | "updatedAt">
  >
) {
  return collection()
    .doc(videoId)
    .create({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
}

/**
 * Update a video with a specific id
 * @param {string} videoId
 * @param {firestore.WithFieldValue<Partial<VideoType>>} data
 * @return {Promise<WriteResult>}
 */
async function update(
  videoId: string,
  data: admin.firestore.WithFieldValue<Partial<VideoType>>
) {
  return collection()
    .doc(videoId)
    .update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
}

export const FirestoreVideo = {
  collection,
  document,
  get,
  create,
  update,
};
