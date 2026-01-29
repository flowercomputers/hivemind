import Fastify from "fastify";
import { randomUUID } from "node:crypto";

import env from "@/config";
import createServer from "@/server/create-server";

async function init() {
  const fastify = Fastify({
    genReqId: function (req) {
      return (req.headers["request-id"] as string) ?? randomUUID();
    },
    ignoreDuplicateSlashes: true,
  });

  const server = await createServer(fastify);

  try {
    await server.listen({ port: env.server.port, host: env.server.host });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

init();
