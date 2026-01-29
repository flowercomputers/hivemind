import { FastifyInstance } from "fastify";

import searchSearchHandler from "./search.handler";
import { searchSchema } from "./search.schema";

export default async function searchSearchRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/mindchunks/search",
    schema: searchSchema,
    handler: searchSearchHandler(),
  });
}
