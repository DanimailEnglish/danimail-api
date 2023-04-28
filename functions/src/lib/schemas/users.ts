import { JSONSchemaType } from "ajv";

import { FirestoreUserWritableFields } from "../../types";
import { ajv } from "./ajv";

const updateUserSchema: JSONSchemaType<FirestoreUserWritableFields> = {
  type: "object",
  properties: {
    firstName: { type: "string", nullable: true, minLength: 1, maxLength: 100 },
    lastName: { type: "string", nullable: true, minLength: 1, maxLength: 100 },
  },
  additionalProperties: false,
};

export const validateUpdateUser = ajv.compile(updateUserSchema);
