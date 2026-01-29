import AutoLoad from "@fastify/autoload";
import { FastifyInstance } from "fastify";
import staticPlugin from "@fastify/static";
import path from "node:path";

import config from "@/config";
import { getDatabase } from "@/db/index.js";
import { agentTracker } from "@/middleware/agent-tracker.js";

export default async function createServer(fastify: FastifyInstance) {
  // Initialize database
  getDatabase();

  // Track agent activity
  fastify.addHook("onRequest", agentTracker);

  fastify.setErrorHandler(async (error, request, reply) => {
    // if the error is a validation error, send a 400 response
    if (error.code === "FST_ERR_VALIDATION") {
      return reply.status(400).send({
        error: "Bad Request",
        requestId: request.id,
        message: error.message,
      });
    }

    // Log SQLite errors
    if (error.message && error.message.includes("SQLite")) {
      console.error("Database error:", error);
    }

    reply.status(500).send({
      error: "Internal Server Error",
      requestId: request.id,
    });
  });

  fastify.register(staticPlugin, {
    root: path.join(__dirname, "../public"),
    prefix: "/public/",
  })

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "../routes"),
    dirNameRoutePrefix: false,
    matchFilter: (filename) => /\.(route)\.(ts|js)$/.test(filename),
  });


  const flowers = ["💐", "🌸", "🌹", "🌺", "🌻", "🌼", "🌷", "🪻"];
  fastify.get("/", async () => {
    return {
      status: flowers[Date.now() % flowers.length],
      on: config.version,
    };
  });

  return fastify;
}
