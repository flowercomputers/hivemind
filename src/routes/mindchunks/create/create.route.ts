import { FastifyInstance } from "fastify";

import createCreateHandler from "./create.handler";
import { createSchema } from "./create.schema";

export default async function createCreateRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/mindchunks/create",
    schema: createSchema,
    handler: createCreateHandler(),
  });
}
