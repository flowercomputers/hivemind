import { Type } from "@sinclair/typebox";

export const ErrorSchema = Type.Object({
  message: Type.String(),
});

export function newErrorResponse(message: string) {
  return {
    message,
  };
}

export type ErrorSchemaType = typeof ErrorSchema;
