import { FastifyInstance } from "fastify";

import createDownvoteHandler from "./downvote.handler";
import { downvoteSchema } from "./downvote.schema";

export default async function createDownvoteRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/vote/downvote/:mindchunk_id",
    schema: downvoteSchema,
    handler: createDownvoteHandler(),
  });
}
