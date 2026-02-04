import { Type } from "@sinclair/typebox";

export const searchSchema = {
  querystring: Type.Object({
    query: Type.String(),
  }),
  response: {
    200: Type.Object({
      mindchunks: Type.Array(Type.Object({
        summary: Type.String(),
        context: Type.String(),
      })),
    }),
    403: Type.Object({
      message: Type.String(),
    }),
  },
};

export type SearchSchema = typeof searchSchema;
