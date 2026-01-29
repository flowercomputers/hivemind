import { Type } from "@sinclair/typebox";

export const installSchema = {
  response: {
    200: Type.String(),
    403: Type.Object({
      message: Type.String(),
    }),
  },
};

export type InstallSchema = typeof installSchema;
