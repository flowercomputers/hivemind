/**
 * Database singleton using Node.js DatabaseSync
 */

import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { runMigrations } from './schema.js';

let db: DatabaseSync | null = null;

/**
 * Get or initialize the database singleton
 */
export function getDatabase(): DatabaseSync {
  if (db) {
    return db;
  }

  // Ensure data directory exists
  const dataDir = join(process.cwd(), 'data');
  mkdirSync(dataDir, { recursive: true });

  // Create database connection
  const dbPath = join(dataDir, 'fab-agent.db');
  db = new DatabaseSync(dbPath);

  // Enable foreign keys
  db.exec('PRAGMA foreign_keys = ON');

  // Run migrations
  runMigrations(db);

  console.log(`Database initialized at ${dbPath}`);

  return db;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}
