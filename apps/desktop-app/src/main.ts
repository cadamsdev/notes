import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import database from './database';
import { Tag } from './interfaces/tag';
import serve from 'electron-serve';

const loadURL = serve({ directory: 'out' });

let win: BrowserWindow;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // if (process.env.PROD) {
  //   win.loadFile('../web-app/build/index.html');
  // } else {
  //   win.loadURL('http://localhost:5173');
  // }

  loadURL(win);
};

const main = async () => {
  const db = await database.connect();
  console.log('connected!');
  await app.whenReady();

  ipcMain.handle('createNote', async (_, title, content) => {
    const result = await db.run(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      title,
      content
    );
    return result.lastID;
  });

  ipcMain.handle('getNotes', async () => {
    const result = await db.all('SELECT * FROM notes');
    return result;
  });

  ipcMain.handle('updateNote', async (_, note) => {
    const id = note.id;
    const title = note.title || 'New note';
    const content = note.content;
    const result = await db.run(
      'UPDATE notes SET title = ?, content = ? WHERE id = ?',
      title,
      content,
      id,
    );
    return result.changes;
  });

  ipcMain.handle('getAllTags', async () => {
    const query = `
      select t.id, t.name, count(*) as \`count\` from tags as t
      left join note_tags as nt on nt.tag_id = t.id
      group by t.id
      order by \`count\` desc
    `;
    const result = await db.all(query);
    return result;
  });

  ipcMain.handle('getTagsForNote', async (_, noteId) => {
    const query = `select t.id, t.name from tags as t
join note_tags as nt on nt.tag_id = t.id
where nt.note_id = ?`;
    const result = await db.all(query, noteId);
    return result;
  });

  ipcMain.handle('saveTags', async (_, noteId: number, tags: Tag[]) => {
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

      const result = await db.run(query, sqlData);
      const { changes, lastID } = result;

      if (changes && lastID) {
        query = `
          INSERT OR IGNORE INTO note_tags (note_id, tag_id)
          VALUES
        `;

        sqlData = [];

        const startIndex = lastID - changes;
        for (let i = startIndex; i < lastID; i++) {
          query += '(?, ?)';
          query += i < lastID - 1 ? ',' : ';';
          sqlData.push(noteId);
          sqlData.push(i + 1);
        }

        await db.run(query, sqlData);
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

      await db.run(query, sqlData);
    }
  });

  ipcMain.handle('deleteNote', async (_, noteId) => {
    const query = 'delete from notes where id = ?';
    const result = await db.run(query, noteId);
    return result;
  });

  ipcMain.handle('deleteTag', async (_, tagId) => {
    const query = 'delete from tags where id = ?';
    const result = await db.run(query, tagId);
    return result;
  });

  ipcMain.handle('editTag', async (_, tag) => {
    if (!tag.name) {
      throw new Error('editTag tag.name does not exist');
    }

    if (!tag.id || tag.id <= 0) {
      throw new Error(`editTag invalid tag.id=${tag.id}`);
    }

    const query = `
      update tags
      set name = ?
      where id = ?;
    `;

    const result = await db.run(query, tag.name, tag.id);
    return result;
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

main();
