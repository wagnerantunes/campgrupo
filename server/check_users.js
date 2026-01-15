import { query } from './dist/db.js';
try {
  const r = await query('SELECT username FROM admin_users');
  console.log('USERS:', JSON.stringify(r.rows));
} catch (e) {
  console.error('ERROR:', e.message);
}
process.exit(0);
