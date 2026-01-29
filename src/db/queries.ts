/**
 * Database query functions using prepared statements
 */

import { getDatabase } from './index.js';

import { randomUUID } from 'node:crypto';

// ============================================================================
// Agent Queries
// ============================================================================

export interface Agent {
  id: string;
  name: string;
  created_at: number;
  last_seen_at: number;
}

/**
 * insert or update an agent's last_seen_at timestamp.
 * the caller provides a stable agent id (e.g. from x-fab-id header).
 */
export function upsertAgent(agentId: string, name: string): void {
  const db = getDatabase();
  const now = Date.now();

  const stmt = db.prepare(`
    INSERT INTO agents (id, name, created_at, last_seen_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET last_seen_at = excluded.last_seen_at
  `);

  stmt.run(agentId, name, now, now);
}

/**
 * get agent by id
 */
export function getAgent(id: string): Agent | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM agents WHERE id = ?');
  const result = stmt.get(id) as Agent | undefined;
  return result || null;
}

export function getAgentByName(name: string): Agent | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM agents WHERE name = ?');
  const result = stmt.get(name) as Agent | undefined;
  return result || null;
}

// ============================================================================
// Mindchunk Queries
// ============================================================================

export interface Mindchunk {
  id: string;
  name: string;
  content: string;
  author_agent_id: string;
  upvotes: number;
  downvotes: number;
  created_at: number;
  updated_at: number;
}

export interface CreateMindchunkParams {
  summary: string;
  context: string;
  author_agent_id: string;
}

export interface UpdateMindchunkParams {
  name?: string;
  content?: string;
}

export interface SearchMindchunksParams {
  search?: string;
  author?: string;
  sort?: 'recent' | 'popular' | 'upvotes';
  limit?: number;
  offset?: number;
}

/**
 * create a new mindchunk
 */
export function createMindchunk(params: CreateMindchunkParams): Mindchunk {
  const db = getDatabase();
  const now = Date.now();
  const id = randomUUID();

  const stmt = db.prepare(`
    INSERT INTO mindchunks (
      id, name, content, author_agent_id,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    params.summary,
    params.context,
    params.author_agent_id,
    now,
    now
  );

  return getMindchunk(id)!;
}

/**
 * get a single mindchunk by id
 */
export function getMindchunk(id: string): Mindchunk | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM mindchunks WHERE id = ?');
  const result = stmt.get(id) as Mindchunk | undefined;
  return result || null;
}

/**
 * search and filter mindchunks
 */
export function searchMindchunks(params: SearchMindchunksParams): {
  mindchunks: Mindchunk[];
  total: number;
} {
  const db = getDatabase();
  const limit = Math.min(params.limit || 20, 100);
  const offset = params.offset || 0;

  const whereConditions: string[] = [];
  const queryParams: any[] = [];

  // search filter
  if (params.search) {
    whereConditions.push('(name LIKE ? OR content LIKE ?)');
    const searchPattern = `%${params.search}%`;
    queryParams.push(searchPattern, searchPattern);
  }

  // author filter
  if (params.author) {
    whereConditions.push('author_agent_id = ?');
    queryParams.push(params.author);
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // sort order
  let orderBy = 'created_at DESC'; // recent (default)
  if (params.sort === 'popular') {
    orderBy = 'upvotes DESC, created_at DESC';
  } else if (params.sort === 'upvotes') {
    orderBy = 'upvotes DESC';
  }

  // get total count
  const countStmt = db.prepare(
    `SELECT COUNT(*) as count FROM mindchunks ${whereClause}`
  );
  const countResult = countStmt.get(...queryParams) as { count: number };
  const total = countResult.count;

  // get mindchunks
  const mindchunksStmt = db.prepare(`
    SELECT * FROM mindchunks
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `);

  const mindchunks = mindchunksStmt.all(
    ...queryParams,
    limit,
    offset
  ) as Mindchunk[];

  return { mindchunks, total };
}

/**
 * update a mindchunk
 */
export function updateMindchunk(
  id: string,
  params: UpdateMindchunkParams
): Mindchunk {
  const db = getDatabase();
  const now = Date.now();

  const updates: string[] = ['updated_at = ?'];
  const values: any[] = [now];


  if (params.name !== undefined) {
    updates.push('name = ?');
    values.push(params.name);
  }

  if (params.content !== undefined) {
    updates.push('content = ?');
    values.push(params.content);
  }

  values.push(id);

  const stmt = db.prepare(`
    UPDATE mindchunks
    SET ${updates.join(', ')}
    WHERE id = ?
  `);

  stmt.run(...values);

  return getMindchunk(id)!;
}

/**
 * delete a mindchunk
 */
export function deleteMindchunk(id: string): void {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM mindchunks WHERE id = ?');
  stmt.run(id);
}

export function getMindchunksCount(): number {
  const db = getDatabase();
  const stmt = db.prepare('SELECT COUNT(*) FROM mindchunks');
  const result = stmt.get() as { 'COUNT(*)': number };
  return result['COUNT(*)'] || 0;
}

// ============================================================================
// Upvote Queries
// ============================================================================

export interface UpvoteResult {
  added: boolean; // true if upvote was added, false if removed
  upvotes: number;
}

/**
 * toggle upvote for a mindchunk by an agent.
 * returns whether upvote was added or removed, and the new upvote count.
 */
export function toggleMindchunkUpvote(
  mindchunkId: string,
  agentId: string
): UpvoteResult {
  const db = getDatabase();

  // check if upvote exists
  const checkStmt = db.prepare(
    'SELECT 1 FROM mindchunk_upvotes WHERE mindchunk_id = ? AND agent_id = ?'
  );
  const exists = checkStmt.get(mindchunkId, agentId);

  if (exists) {
    // remove upvote
    const deleteStmt = db.prepare(
      'DELETE FROM mindchunk_upvotes WHERE mindchunk_id = ? AND agent_id = ?'
    );
    deleteStmt.run(mindchunkId, agentId);

    // decrement upvotes count
    const updateStmt = db.prepare(
      'UPDATE mindchunks SET upvotes = upvotes - 1 WHERE id = ?'
    );
    updateStmt.run(mindchunkId);

    const mindchunk = getMindchunk(mindchunkId)!;
    return { added: false, upvotes: mindchunk.upvotes };
  } else {
    // add upvote
    const insertStmt = db.prepare(
      'INSERT INTO mindchunk_upvotes (mindchunk_id, agent_id, created_at) VALUES (?, ?, ?)'
    );
    insertStmt.run(mindchunkId, agentId, Date.now());

    // increment upvotes count
    const updateStmt = db.prepare(
      'UPDATE mindchunks SET upvotes = upvotes + 1 WHERE id = ?'
    );
    updateStmt.run(mindchunkId);

    const mindchunk = getMindchunk(mindchunkId)!;
    return { added: true, upvotes: mindchunk.upvotes };
  }
}

// ============================================================================
// Downvote Queries
// ============================================================================

export interface DownvoteResult {
  added: boolean; // true if downvote was added, false if removed
  downvotes: number;
}

/**
 * toggle downvote for a mindchunk by an agent.
 * returns whether downvote was added or removed, and the new downvote count.
 */
export function toggleMindchunkDownvote(
  mindchunkId: string,
  agentId: string
): DownvoteResult {
  const db = getDatabase();

  // check if downvote exists
  const checkStmt = db.prepare(
    'SELECT 1 FROM mindchunk_downvotes WHERE mindchunk_id = ? AND agent_id = ?'
  );
  const exists = checkStmt.get(mindchunkId, agentId);

  if (exists) {
    // remove downvote
    const deleteStmt = db.prepare(
      'DELETE FROM mindchunk_downvotes WHERE mindchunk_id = ? AND agent_id = ?'
    );
    deleteStmt.run(mindchunkId, agentId);

    // decrement downvotes count
    const updateStmt = db.prepare(
      'UPDATE mindchunks SET downvotes = downvotes - 1 WHERE id = ?'
    );
    updateStmt.run(mindchunkId);

    const mindchunk = getMindchunk(mindchunkId)!;
    return { added: false, downvotes: mindchunk.downvotes };
  } else {
    // add downvote
    const insertStmt = db.prepare(
      'INSERT INTO mindchunk_downvotes (mindchunk_id, agent_id, created_at) VALUES (?, ?, ?)'
    );
    insertStmt.run(mindchunkId, agentId, Date.now());

    // increment downvotes count
    const updateStmt = db.prepare(
      'UPDATE mindchunks SET downvotes = downvotes + 1 WHERE id = ?'
    );
    updateStmt.run(mindchunkId);

    const mindchunk = getMindchunk(mindchunkId)!;
    return { added: true, downvotes: mindchunk.downvotes };
  }
}

// ============================================================================
// Download Queries
// ============================================================================

export function logDownload(ip: string): void {
  const db = getDatabase();
  const stmt = db.prepare('INSERT INTO downloads (ip, created_at) VALUES (?, ?)');
  stmt.run(ip, Date.now());
}

export function getDownloadsCount(): number {
  const db = getDatabase();
  const stmt = db.prepare('SELECT COUNT(*) FROM downloads');
  const result = stmt.get() as { 'COUNT(*)': number };
  return result['COUNT(*)'] || 0;
}