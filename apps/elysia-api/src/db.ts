import { Database } from 'bun:sqlite';
import { Note } from './models/note';
import { Tag } from './models/tag';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const dataDir = './data';

if (!existsSync(dataDir)) {
  mkdirSync(dataDir);
}

const dbFile = `${dataDir}/database.sqlite`;

if (!existsSync(dbFile)) {
  writeFileSync(dbFile, '');  
}

const db = new Database(dbFile);

seed();

function seed() {
  const sql = `
    create table if not exists notes(
      id integer primary key autoincrement not null,
      title text not null,
      content text,
      created_at datetime default current_timestamp,
      updated_at datetime
    );

    create table if not exists tags(
      id integer primary key autoincrement not null,
      name text not null,
      color TEXT,
      UNIQUE (name)
    );

    create table if not exists note_tags (
      note_id integer NOT NULL,
      tag_id integer NOT NULL,
      primary key (note_id, tag_id),
      foreign key (note_id) references notes(id) on delete cascade,
      foreign key (tag_id) references tags(id) on delete cascade
    );

    create table if not exists settings (
      id integer primary key autoincrement,
      name text unique,
      value integer default 0
    );

    insert into settings(name, value)
    values('tag_sort', 0)
    on conflict(name) do nothing;
  `;

  console.log('Seeding database...'); 
  db.exec(sql);
  console.log('Database seeded');
}

export function createNote(title: string, content: string) {
  const sql = `INSERT INTO notes (title, content) VALUES (?, ?)`;
  // @ts-ignore - Bun SQLite accepts individual parameters despite type definitions
  const result = db.run(sql, title, content);
  return result.lastInsertRowid;
}

export function getNotes(): Note[] {
  const notesQuery = `
    SELECT
      n.id,
      n.title,
      n.content,
      n.created_at,
      n.updated_at,
      t.id as tag_id,
      t.name as tag_name,
      t.color as tag_color
    FROM notes as n
    LEFT JOIN note_tags as nt ON nt.note_id = n.id
    LEFT JOIN tags as t ON t.id = nt.tag_id
    ORDER BY n.created_at DESC
  `;

  const notesResult = db.query(notesQuery).all() as {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    tag_id: number;
    tag_name: string;
    tag_color: string;
    tags?: Tag[];
  }[];

  const notesById: Record<number, Note> = {};

  for (const row of notesResult) {
    if (!notesById[row.id]) {
      notesById[row.id] = {
        id: row.id,
        title: row.title,
        content: row.content,
        created_at: row.created_at,
        updated_at: row.updated_at,
        tags: [],
      };
    }

    if (row.tag_id) {
      notesById[row.id].tags?.push({
        id: row.tag_id,
        name: row.tag_name,
        color: row.tag_color,
      });
    }
  }

  return Object.values(notesById);
}

export function getNoteForId(id: number): Note | null {
  const notesQuery = `
    SELECT
      n.id,
      n.title,
      n.content,
      n.created_at,
      n.updated_at,
      t.id as tag_id,
      t.name as tag_name,
      t.color as tag_color
    FROM notes as n
    LEFT JOIN note_tags as nt ON nt.note_id = n.id
    LEFT JOIN tags as t ON t.id = nt.tag_id
    WHERE n.id = ?
    ORDER BY n.created_at DESC
  `;

  // @ts-ignore - Bun SQLite accepts individual parameters
  const notesResult = db.query(notesQuery).all(id) as {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    tag_id: number;
    tag_name: string;
    tag_color: string;
    tags?: Tag[];
  }[];

  if (notesResult.length === 0) {
    return null;
  }

  const note: Note = {
    id: notesResult[0].id,
    title: notesResult[0].title,
    content: notesResult[0].content,
    created_at: notesResult[0].created_at,
    updated_at: notesResult[0].updated_at,
    tags: [],
  };

  for (const row of notesResult) {
    if (row.tag_id) {
      note.tags?.push({
        id: row.tag_id,
        name: row.tag_name,
        color: row.tag_color,
      });
    }
  }

  return note;
}

export function updateNote(note: Note) {
  const id = note.id;
  const title = note.title || 'New note';
  const content = note.content || '';

  const sql = `UPDATE notes SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?`;
  // @ts-ignore - Bun SQLite accepts individual parameters
  const result = db.run(sql, title, content, id);
  return result;
}

export function updateTagSort(tagSort: number) {
  const sql = `UPDATE settings SET value = ? WHERE name = 'tag_sort'`;
  // @ts-ignore - Bun SQLite accepts individual parameters
  const result = db.run(sql, tagSort);
  return result;
}

export function updateSettings(name: string, value: number) {
  const sql = `UPDATE settings SET value = ? WHERE name = ?`;
  // @ts-ignore - Bun SQLite accepts individual parameters
  const result = db.run(sql, value, name);
  return result;
}

export function getTagSort(): number {
  const sql = `SELECT value FROM settings WHERE name = 'tag_sort'`;
  const result = db.query(sql).get() as { value: number } | null;
  return result?.value ?? 0;
}

export function getAllTags(): Tag[] {
  const sql = `SELECT * FROM tags ORDER BY name`;
  const result = db.query(sql).all() as Tag[];
  return result;
}

export function getTagsForNote(noteId: number): Tag[] {
  const sql = `
    SELECT t.* FROM tags as t
    JOIN note_tags as nt ON t.id = nt.tag_id
    WHERE nt.note_id = ?
  `;
  // @ts-ignore - Bun SQLite accepts individual parameters
  const result = db.query(sql).all(noteId) as Tag[];
  return result;
}

export function saveTags(noteId: number, tags: Tag[]) {
  // Remove existing tags for this note
  const deleteQuery = `DELETE FROM note_tags WHERE note_id = ?`;
  // @ts-ignore - Bun SQLite accepts individual parameters
  db.run(deleteQuery, noteId);

  if (tags.length === 0) return;

  // Insert/update tags and link them to the note
  for (const tag of tags) {
    // Insert or update the tag
    const tagQuery = `
      INSERT INTO tags (name, color) VALUES (?, ?)
      ON CONFLICT(name) DO UPDATE SET color = excluded.color
    `;
    // @ts-ignore - Bun SQLite accepts individual parameters
    db.run(tagQuery, tag.name, tag.color || '');

    // Get the tag ID
    const tagIdQuery = `SELECT id FROM tags WHERE name = ?`;
    // @ts-ignore - Bun SQLite accepts individual parameters
    const tagResult = db.query(tagIdQuery).get(tag.name) as { id: number };

    // Link the tag to the note
    const linkQuery = `INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)`;
    // @ts-ignore - Bun SQLite accepts individual parameters
    db.run(linkQuery, noteId, tagResult.id);
  }
}

export function deleteNote(noteId: number) {
  const sql = `DELETE FROM notes WHERE id = ?`;
  // @ts-ignore - Bun SQLite accepts individual parameters
  const result = db.run(sql, noteId);
  return result;
}

export function deleteTag(tagId: number) {
  const sql = `DELETE FROM tags WHERE id = ?`;
  // @ts-ignore - Bun SQLite accepts individual parameters
  const result = db.run(sql, tagId);
  return result;
}

export function updateTag(tag: Tag) {
  const sql = `UPDATE tags SET name = ?, color = ? WHERE id = ?`;
  // @ts-ignore - Bun SQLite accepts individual parameters
  const result = db.run(sql, tag.name, tag.color || '', tag.id);
  return result;
}
