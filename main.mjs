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
    console.log('recieved:', title, content);
    const result = await db.run(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      title,
      content
    );
    console.log('result:', result);
    return result.lastID;
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
