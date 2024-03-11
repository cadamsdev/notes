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

  ipcMain.handle('updateNote', async (_, id, content) => {
    const result = await db.run(
      'UPDATE notes SET content = ? WHERE id = ?',
      content,
      id,
    );
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
