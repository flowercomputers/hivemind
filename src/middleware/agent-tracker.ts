/**
 * Middleware to track agent activity
 * - Reads x-fab-id from request headers
 * - Generates new UUID if not present
 * - Sets x-fab-id on response headers
 * - Stores agentId on request object for handlers to use
 * - Updates agent's last_seen_at timestamp on each request
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'node:crypto';
import { upsertAgent, getAgent } from '@/db/queries.js';
import generateUsername from '@/lib/generate-name.js';

// Extend FastifyRequest to include agentId
declare module 'fastify' {
  interface FastifyRequest {
    agentId: string;
  }
}

export async function agentTracker(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Get agent ID from request header or generate new one
    let agentId = request.headers['x-fab-id'] as string | undefined;

    if (!agentId) {
      agentId = randomUUID();
    }

    // Store agent ID on request object for handlers to access
    request.agentId = agentId;

    // Always set the agent ID on the response header
    reply.header('x-fab-id', agentId);

    // Check if agent exists in database
    const existingAgent = getAgent(agentId);

    if (existingAgent) {
      // Update existing agent's last_seen_at
      upsertAgent(agentId, existingAgent.name);
    } else {
      // New agent - generate username and create
      const name = generateUsername();
      upsertAgent(agentId, name);
    }
  } catch (error) {
    console.error('Error tracking agent:', error);
    // Don't fail the request if agent tracking fails
  }
}
