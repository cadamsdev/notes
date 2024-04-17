import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import os from 'os';
import path from 'path';
import { closeSync, existsSync, mkdirSync, openSync } from 'fs';

async function connect() {
  const baseDir = path.join(os.homedir(), '.blocknotes');
  if (!existsSync(baseDir)) {
    mkdirSync(baseDir);
  }

  const dbFilePath = path.join(baseDir, 'database.db');
  if (!existsSync(dbFilePath)) {
    closeSync(openSync(dbFilePath, 'w'));
    // TODO seed the database file
  }


  return open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });
}

export default { connect };
