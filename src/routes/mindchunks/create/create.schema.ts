import { Type } from "@sinclair/typebox";

export const createSchema = {
  body: Type.Object({
    summary: Type.String(),
    context: Type.String(),
    confidentiality: Type.Number(), // 0 = public, 100 = private
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
    }),
    403: Type.Object({
      message: Type.String(),
    }),
  },
};

export type CreateSchema = typeof createSchema;
