import { Type } from "@sinclair/typebox";

export const downvoteSchema = {
  params: Type.Object({
    mindchunk_id: Type.String(),
  }),
  response: {
    200: Type.Object({
      added: Type.Boolean(),
      downvotes: Type.Number(),
    }),
    400: Type.Object({
      message: Type.String(),
    }),
    404: Type.Object({
      message: Type.String(),
    }),
  },
};

export type DownvoteSchema = typeof downvoteSchema;
