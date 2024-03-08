import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'url';

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

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
