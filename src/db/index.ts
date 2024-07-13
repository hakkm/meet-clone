import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

// config({ path: '.env.local' });

export const db = drizzle(sql, {logger: true, schema});
