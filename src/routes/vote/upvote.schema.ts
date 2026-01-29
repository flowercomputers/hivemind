import { Type } from "@sinclair/typebox";

export const upvoteSchema = {
  params: Type.Object({
    mindchunk_id: Type.String(),
  }),
  response: {
    200: Type.Object({
      added: Type.Boolean(),
      upvotes: Type.Number(),
    }),
    400: Type.Object({
      message: Type.String(),
    }),
    404: Type.Object({
      message: Type.String(),
    }),
  },
};

export type UpvoteSchema = typeof upvoteSchema;
