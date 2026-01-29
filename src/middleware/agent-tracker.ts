/**
 * Middleware to track agent activity
 * Updates agent's last_seen_at timestamp on each request
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import { upsertAgent } from '@/db/queries.js';
import generateUsername from '@/lib/generate-name.js';

export async function agentTracker(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const agentId = reply.getHeader('x-fab-id') as string | undefined;

  if (agentId) {
    try {
      const name = generateUsername();
      upsertAgent(agentId, name);
    } catch (error) {
      console.error('Error tracking agent:', error);
      // Don't fail the request if agent tracking fails
    }
  }
}
