import { FastifyInstance } from "fastify";

import installInstallHandler from "./install.handler";
import { installSchema } from "./install.schema";

export default async function installInstallRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/install",
    schema: installSchema,
    handler: installInstallHandler(),
  });

  // Backwards compatibility alias
  fastify.route({
    method: "GET",
    url: "/install.sh",
    schema: installSchema,
    handler: installInstallHandler(),
  });
}
