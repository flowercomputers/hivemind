import { Type } from "@sinclair/typebox";

export const metaSchema = {
  response: {
    200: Type.Object({
      version: Type.String(),
      downloads: Type.Number(),
      mindchunks: Type.Number(),
    }),
    403: Type.Object({
      message: Type.String(),
    }),
  },
};

export type MetaSchema = typeof metaSchema;
