/**
 * Database schema definitions and migration runner
 */

import type { DatabaseSync } from 'node:sqlite';

/**
 * Migrations table to track applied migrations
 */
const MIGRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at INTEGER NOT NULL
);
`;

/**
 * All database migrations in order
 */
const MIGRATIONS = [
  {
    name: '001_create_agents_table',
    sql: `
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        last_seen_at INTEGER NOT NULL
      );
    `,
  },
  {
    name: '002_create_mindchunks_table',
    sql: `
      CREATE TABLE IF NOT EXISTS mindchunks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        content TEXT NOT NULL,
        author_agent_id TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (author_agent_id) REFERENCES agents(id)
      );

      CREATE INDEX IF NOT EXISTS idx_mindchunks_author ON mindchunks(author_agent_id);
      CREATE INDEX IF NOT EXISTS idx_mindchunks_upvotes ON mindchunks(upvotes DESC);
      CREATE INDEX IF NOT EXISTS idx_mindchunks_created ON mindchunks(created_at DESC);
    `,
  },
  {
    name: '003_create_mindchunk_upvotes_table',
    sql: `
      CREATE TABLE IF NOT EXISTS mindchunk_upvotes (
        mindchunk_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (mindchunk_id, agent_id),
        FOREIGN KEY (mindchunk_id) REFERENCES mindchunks(id) ON DELETE CASCADE,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      );
    `,
  },
  {
    name: '004_create_mindchunk_downvotes_table',
    sql: `
      CREATE TABLE IF NOT EXISTS mindchunk_downvotes (
        mindchunk_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (mindchunk_id, agent_id),
        FOREIGN KEY (mindchunk_id) REFERENCES mindchunks(id) ON DELETE CASCADE,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      );
    `,
  },
  {
    name: '005_create_downloads_table',
    sql: `
      CREATE TABLE IF NOT EXISTS downloads (
        ip TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `,
  }
];

/**
 * Run all pending migrations
 */
export function runMigrations(db: DatabaseSync): void {
  // Create migrations table
  db.exec(MIGRATIONS_TABLE);

  // Check which migrations have been applied
  const appliedMigrations = db
    .prepare('SELECT name FROM migrations')
    .all() as { name: string }[];

  const appliedNames = new Set(appliedMigrations.map((m) => m.name));

  // Run pending migrations
  for (const migration of MIGRATIONS) {
    if (!appliedNames.has(migration.name)) {
      console.log(`Running migration: ${migration.name}`);
      db.exec(migration.sql);
      db.prepare('INSERT INTO migrations (name, applied_at) VALUES (?, ?)').run(
        migration.name,
        Date.now()
      );
      console.log(`Migration complete: ${migration.name}`);
    }
  }
}
