import Database from 'better-sqlite3';
import { Note } from './models/note';
import { Tag } from './models/tag';

const db = new Database(process.env.DB_PATH);

db.pragma('journal_mode = WAL');
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
  const sql = `
    INSERT INTO notes (title, content) VALUES (?, ?)
  `;

  const result = db.prepare(sql).run(title, content);
  return result.lastInsertRowid;
}

export function getNotes(): Note[] {
  const notesQuery = `
    SELECT
      n.id,
      n.title,
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

  const notesResult = db.prepare(notesQuery).all() as {
    id: number;
    title: string;
    tag_id: number;
    tag_name: string;
    tag_color: string;
    tags?: Tag[];
  }[];

  const mergedNotes = notesResult.reduce(
    (acc, curr) => {
      const existing = acc.find((note) => note.id === curr.id);
      if (existing) {
        existing.tags.push({
          id: curr.tag_id,
          name: curr.tag_name,
          color: curr.tag_color,
        });
      } else {
        acc.push({
          id: curr.id,
          title: curr.title,
          tags: curr.tag_id
            ? [{ id: curr.tag_id, name: curr.tag_name, color: curr.tag_color }]
            : [],
        });
      }

      return acc;
    },
    [] as {
      id: number;
      title: string;
      tag_id?: number;
      tag_name?: string;
      tag_color?: string;
      tags: Tag[];
    }[]
  );

  return mergedNotes;
}

export function getNoteForId(id: number): Note | null {
  const notesQuery = `
    SELECT
      n.id,
      n.title,
      n.content,
      t.id as tag_id,
      t.name as tag_name
    FROM notes as n
    LEFT JOIN note_tags as nt ON nt.note_id = n.id
    LEFT JOIN tags as t ON t.id = nt.tag_id
    WHERE n.id = ?
  `;

  const notesResult = db.prepare(notesQuery).all(id) as {
    id: number;
    title: string;
    content: string;
    tag_id: number;
    tag_name: string;
    tags?: Tag[];
  }[];

  if (notesResult.length > 0) {
    const note: Note = {
      id: notesResult[0].id,
      title: notesResult[0].title,
      content: notesResult[0].content,
      tags: notesResult
        .filter((tag) => tag.tag_id)
        .map((tag) => ({ id: tag.tag_id, name: tag.tag_name })),
    };

    return note;
  }

  return null;
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

export function updateTagSort(tagSort: number) {
  const sql = `
    UPDATE settings SET value = ? WHERE name = 'tag_sort'
  `;

  const result = db.prepare(sql).run(tagSort);
  return result;
}

// get tag sort
export function getTagSort() {
  const sql = `
    SELECT value FROM settings WHERE name = 'tag_sort';
  `;

  const result = db.prepare<{ value: number }[], { value: number }>(sql).get();
  return result?.value ?? 0;
}

export function getAllTags() {
  const sql = `
    select t.id, t.name, t.color, count(nt.tag_id) as \`count\` from tags as t
    left join note_tags as nt on nt.tag_id = t.id
    group by t.id
  `;

  const result = db.prepare(sql).all();
  return result;
}

export function getTagsForNote(noteId: number): Tag[] {
  const sql = `select t.id, t.name, t.color from tags as t
  join note_tags as nt on nt.tag_id = t.id
  where nt.note_id = ?`;

  const result = db.prepare(sql).all(noteId);
  return result as Tag[];
}

export function saveTags(noteId: number, tags: Tag[]) {
  const newTags = tags.filter((tag) => tag.id === -1);
  const tagsToAdd = tags.filter((tag) => tag.id !== -1);
  const currentTags = getTagsForNote(noteId);
  const tagsToDelete = currentTags.filter(
    (tag) => !tagsToAdd.find((t) => t.id === tag.id)
  );

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
      sqlData.push(tag.name);
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

      const startIndex = (lastID as number) - changes;
      for (let i = startIndex; i < lastID; i++) {
        query += '(?, ?)';
        query += i < lastID - 1 ? ',' : ';';
        sqlData.push(noteId);
        sqlData.push(i + 1);
      }

      db.prepare(query).run(sqlData);
    }
  }

  if (tagsToAdd.length) {
    let query = `
      INSERT OR IGNORE INTO note_tags (note_id, tag_id)
      VALUES
    `;

    const sqlData = [];

    for (let i = 0; i < tagsToAdd.length; i++) {
      query += '(?, ?)';
      query += i < tagsToAdd.length - 1 ? ',' : ';';

      const tag = tagsToAdd[i];
      sqlData.push(noteId);
      sqlData.push(tag.id);
    }

    db.prepare(query).run(sqlData);
  }

  if (tagsToDelete.length) {
    let query = `
      DELETE FROM note_tags
      WHERE note_id = ? AND tag_id IN (
    `;

    const sqlData = [noteId];

    for (let i = 0; i < tagsToDelete.length; i++) {
      query += '?';
      query += i < tagsToDelete.length - 1 ? ',' : ');';

      const tag = tagsToDelete[i];
      sqlData.push(tag.id);
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

export function updateTag(tag: Tag) {
  const sql = `update tags set name = ?, color = ? where id = ?`;
  const result = db.prepare(sql).run(tag.name, tag.color, tag.id);
  return result;
}
