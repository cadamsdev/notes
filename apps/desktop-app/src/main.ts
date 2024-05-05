import { app, BrowserWindow } from 'electron';
import path from 'node:path';
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
  console.log('connected!');
  await app.whenReady();

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
