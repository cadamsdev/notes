import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import { type Note } from '../../../store';
import type { Tag } from '../../../interfaces/Tag';

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
seed();

function seed() {
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
      foreign key (note_id) references notes(id) on delete cascade,
      foreign key (tag_id) references tags(id) on delete cascade
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

export function getNotes(): Note[] {
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
  `;

	const notesResult = db.prepare(notesQuery).all() as {
		id: number;
		title: string;
    content: string;
		tag_id: number;
		tag_name: string;
    tags?: Tag[];
	}[];

	const mergedNotes = notesResult.reduce(
		(acc, curr) => {
			const existing = acc.find((note) => note.id === curr.id);
			if (existing) {
				existing.tags.push({
					id: curr.tag_id,
					name: curr.tag_name
				});
			} else {
				acc.push({
					id: curr.id,
					title: curr.title,
          content: curr.content,
					tags: curr.tag_id ? [{ id: curr.tag_id, name: curr.tag_name }] : []
				});
			}

			return acc;
		},
		[] as {
			id: number;
			title: string;
      content: string,
			tag_id?: number;
			tag_name?: string;
			tags: Tag[];
		}[]
	);

	return mergedNotes;
}

export function getNotesForId(id: number): Note | null {
	const notesQuery = `
    SELECT
      n.id,
      n.title,
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
      tags: notesResult.filter((tag) => tag.tag_id).map((tag) => ({ id: tag.tag_id, name: tag.tag_name }))
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

export function getTagsForNote(noteId: number): Tag[] {
  const sql = `select t.id, t.name from tags as t
  join note_tags as nt on nt.tag_id = t.id
  where nt.note_id = ?`;

  const result = db.prepare(sql).all(noteId); 
  return result as Tag[];
}

export function saveTags(noteId: number, tags: Tag[]) {
  const newTags = tags.filter((tag) => tag.id === -1);
  const tagsToAdd = tags.filter((tag) => tag.id !== -1);
  const currentTags = getTagsForNote(noteId);
  const tagsToDelete = currentTags.filter((tag) => !tagsToAdd.find((t) => t.id === tag.id));

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
    const query = `
      DELETE FROM note_tags
      WHERE note_id = ? AND tag_id = ?
    `;

    const sqlData = [];

    for (let i = 0; i < tagsToDelete.length; i++) {
      const tag = tagsToDelete[i];
      sqlData.push(noteId);
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
  const sql = `update tags set name = ? where id = ?`;
  const result = db.prepare(sql).run(tag.name, tag.id);
  return result;
}