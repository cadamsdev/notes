import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { Note } from '../../../store';
import type { Tag } from '../../../interfaces/Tag';
import type { TagRecord } from '../../../interfaces/TagRecord';

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
  return result;
}

export function getAllTags() {
  const sql = `
    select t.id, t.name, count(*) as \`count\` from tags as t
    left join note_tags as nt on nt.tag_id = t.id
    group by t.id
    order by \`count\` desc
  `;
  const result = db.prepare(sql).all();
  return result;
}

export function getTagsForNote(noteId: number): TagRecord[] {
  const sql = `select t.id, t.name from tags as t
  join note_tags as nt on nt.tag_id = t.id
  where nt.note_id = ?`;

  const result = db.prepare(sql).all(noteId); 
  return result as TagRecord[];
}

export function saveTags(noteId: number, tags: Tag[]) {
  const newTags = tags.filter((tag) => tag.value === -1);
  const existingTags = tags.filter((tag) => tag.value !== -1);

  if (newTags.length) {
    let query = `
      INSERT INTO tags (name)
      VALUES
    `;

    let sqlData = [];

    for (let i = 0; i < newTags.length; i++) {
      query += '(?)';
      query += i < newTags.length - 1 ? ',' : ';';

      const tag = newTags[i];
      sqlData.push(tag.label);
    }

    const result = db.prepare(query).run(sqlData);
    const { changes, lastInsertRowid } = result;
    const lastID = lastInsertRowid as number;

    if (changes && lastID) {
      query = `
        INSERT OR IGNORE INTO note_tags (note_id, tag_id)
        VALUES
      `;

      sqlData = [];

      const startIndex = lastID as number - changes;
      for (let i = startIndex; i < lastID; i++) {
        query += '(?, ?)';
        query += i < lastID - 1 ? ',' : ';';
        sqlData.push(noteId);
        sqlData.push(i + 1);
      }

      db.prepare(query).run(sqlData);
    }
  }

  if (existingTags.length) {
    let query = `
      INSERT OR IGNORE INTO note_tags (note_id, tag_id)
      VALUES
    `;

    const sqlData = [];

    for (let i = 0; i < existingTags.length; i++) {
      query += '(?, ?)';
      query += i < existingTags.length - 1 ? ',' : ';';

      const tag = existingTags[i];
      sqlData.push(noteId);
      sqlData.push(tag.value);
    }

    db.prepare(query).run(sqlData);
  }
}

export function deleteNote(noteId: number) {
  const sql = `delete from notes where id = ?`;
  const result = db.prepare(sql).run(noteId);
  return result;
}

export function deleteTag(tagId: number) {
  const sql = `delete from tags where id = ?`;
  const result = db.prepare(sql).run(tagId);
  return result;
}

export function updateTag(tag: TagRecord) {
  const sql = `update tags set name = ? where id = ?`;
  const result = db.prepare(sql).run(tag.name, tag.id);
  return result;
}
