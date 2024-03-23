import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'url';
import database from './scripts/database.mjs';

const createWindow = () => {
  const dirname = fileURLToPath(new URL('.', import.meta.url));
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(dirname, 'scripts/preload.js'),
    },
  });

  if (process.env.PROD) {
    win.loadFile('app/build/index.html');
  } else {
    win.loadURL('http://localhost:5173');
  }
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
    const query = `select id, note_id, name from tags`;
    const result = await db.all(query);
    console.log(result);
    return result;
  });

  ipcMain.handle('saveTags', async (_, noteId, tags) => {
    // console.log(noteId, tags);
    const newTags = tags.filter((tag) => tag.value === -1);
    console.log('new tags', newTags);

    let query = `
    INSERT INTO tags (note_id, name)
      VALUES
    `;

    const sqlData = [];

    for (let i = 0; i < newTags.length; i++) {
        query += '(?, ?)';
        query += i < newTags.length - 1 ? ',' : ';';

        const tag = newTags[i];
        sqlData.push(noteId);
        sqlData.push(tag.label);
    }

    const result = await db.run(query, sqlData);
    console.log(result.changes)
    return result.changes;
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
