import { FastifyInstance } from "fastify";

import metaMetaHandler from "./meta.handler";
import { metaSchema } from "./meta.schema";

export default async function metaMetaRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/meta",
    schema: metaSchema,
    handler: metaMetaHandler(),
  });
}
