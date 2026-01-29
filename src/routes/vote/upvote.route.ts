import { FastifyInstance } from "fastify";

import createUpvoteHandler from "./upvote.handler";
import { upvoteSchema } from "./upvote.schema";

export default async function createUpvoteRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/vote/upvote/:mindchunk_id",
    schema: upvoteSchema,
    handler: createUpvoteHandler(),
  });
}
