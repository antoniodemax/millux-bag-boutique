import fs from 'fs';
import path from 'path';
import pool from './index';

/**
 * Idempotent SQL migration runner.
 *
 * Applies every `NNN_name.sql` file in `backend/migrations` in filename order,
 * recording each applied file in `schema_migrations` so it is never re-run.
 * All existing migrations are written with IF NOT EXISTS guards, so running
 * them against an already-migrated database is safe.
 */
const resolveMigrationsDir = (): string | null => {
  const candidates = [
    path.resolve(__dirname, '../../migrations'), // dist/db -> backend/migrations
    path.resolve(process.cwd(), 'migrations'),
    path.resolve(process.cwd(), 'backend/migrations'),
  ];
  return candidates.find((dir) => fs.existsSync(dir)) ?? null;
};

export const runMigrations = async (): Promise<string[]> => {
  const dir = resolveMigrationsDir();
  if (!dir) {
    console.warn('Migrations directory not found; skipping migrations');
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  const applied: string[] = [];
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const done = await client.query('SELECT name FROM schema_migrations');
    const doneSet = new Set(done.rows.map((r: any) => r.name));

    for (const file of files) {
      if (doneSet.has(file)) continue;
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        applied.push(file);
        console.log(`Applied migration: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
  }

  return applied;
};

// Allow `node dist/db/migrate.js` / `tsx src/db/migrate.ts` as a standalone command
if (require.main === module) {
  runMigrations()
    .then((applied) => {
      console.log(applied.length ? `Applied ${applied.length} migration(s)` : 'Database is up to date');
      return pool.end();
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
