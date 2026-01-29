import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  ContextConfigDefault,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { FastifySchema } from "fastify/types/schema";

export type FReq<TSchema extends FastifySchema> = FastifyRequest<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  TSchema,
  TypeBoxTypeProvider
>;

export type FRes<TSchema extends FastifySchema> = FastifyReply<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>;
