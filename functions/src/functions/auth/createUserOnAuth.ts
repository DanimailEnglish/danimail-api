import { FirestoreUser } from "../../lib/firestore/user";
import type { AuthOnCreateHandler } from "../../types";

const createUserOnAuthHandler: AuthOnCreateHandler = async (user) => {
  await FirestoreUser.create(user.uid, {
    email: user.email,
    role: "STUDENT",
    unusedVideos: 0,
  });
};

export default createUserOnAuthHandler;
