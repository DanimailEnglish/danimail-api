import { JSONSchemaType } from "ajv";

import type { UserPublic } from "../../types";
import { ajv } from "./ajv";

const updateUserSchema: JSONSchemaType<UserPublic> = {
  type: "object",
  properties: {
    email: { type: "string", nullable: true },
    phoneNumber: { type: "string", nullable: true },
    firstName: { type: "string", nullable: true, minLength: 1, maxLength: 100 },
    lastName: { type: "string", nullable: true, minLength: 1, maxLength: 100 },
    nickname: { type: "string", nullable: true },
  },
  additionalProperties: false,
};

export const validateUpdateUser = ajv.compile(updateUserSchema);
