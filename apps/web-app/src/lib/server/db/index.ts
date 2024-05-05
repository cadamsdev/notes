import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { Note } from '../../../store';

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
seed();

function seed() {
	db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT
    );
  `);

	const sql = `
    create table if not exists notes(
      id integer primary key autoincrement not null,
      title text not null,
      content text
    );

    create table if not exists tags(
      id integer primary key autoincrement not null,
      name text not null,
      UNIQUE (name)
    );

    create table if not exists note_tags (
      note_id integer NOT NULL,
      tag_id integer NOT NULL,
      primary key (note_id, tag_id),
      foreign key (note_id) references notes(id),
      foreign key (tag_id) references tags(id)
    );
  `;

	db.exec(sql);
}

export function createNote(title: string, content: string) {
  const sql = `
    INSERT INTO notes (title, content) VALUES (?, ?)
  `;

  const result = db.prepare(sql)
  .run(title, content);

  return result.lastInsertRowid;
};

export function getNotes() {
  const sql = `
    SELECT * FROM notes
  `;

  const result = db.prepare(sql).all();
  return result;
}

export function updateNote(note: Note) {
  const id = note.id;
  const title = note.title || 'New note';
  const content = note.content;

  const sql = `
    UPDATE notes SET title = ?, content = ? WHERE id = ?
  `;

  const result = db.prepare(sql).run(title, content, id);

  return {
    result,
  }
}

export function getAllTags() {
  const sql = `
    select t.id, t.name, count(*) as \`count\` from tags as t
    left join note_tags as nt on nt.tag_id = t.id
    group by t.id
    order by \`count\` desc
  `;
  const result = db.prepare(sql).all();
  return {
    result,
  }
}
