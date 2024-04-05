import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function connect() {
  return open({
    filename: 'tmp/database.db',
    driver: sqlite3.Database,
  });
}

export default { connect };
