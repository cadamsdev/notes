import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// open database
open({
  filename: 'tmp/database.db',
  driver: sqlite3.Database,
})
  .then((db) => {
    console.log('connected!');
  })
  .catch((err) => {
    console.error(err);
  });
