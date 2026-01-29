import { Type } from "@sinclair/typebox";

export const searchSchema = {
  querystring: Type.Object({
    query: Type.String(),
  }),
  response: {
    200: Type.Object({
      mindchunks: Type.Array(Type.Object({
        id: Type.String(),
        summary: Type.String(),
        context: Type.String(),
        author: Type.String(),
      })),
    }),
    403: Type.Object({
      message: Type.String(),
    }),
  },
};

export type SearchSchema = typeof searchSchema;
