import fs from 'fs';
import path from 'path';

const webAppDir = path.resolve(__dirname, '../', 'apps', 'web-app');

function renameEnv() {
  const envExampleFilePath = path.resolve(webAppDir, '.env.example');
  const envFilePath = path.resolve(webAppDir, '.env');

  if (fs.existsSync(envFilePath)) {
    console.log('.env file already exists. skipping...');
  } else if (fs.existsSync(envExampleFilePath)) {
    // rename .env.example to .env
    fs.renameSync(envExampleFilePath, path.resolve(webAppDir, '.env'));
  } else {
    console.error('.env.example file does not exist. skipping...');
  }
}

function createDB() {
  // create data folder
  const dataDir = path.resolve(webAppDir, 'data');
  if (fs.existsSync(dataDir)) {
    console.log('data folder already exists. skipping...');
  } else {
    fs.mkdirSync(dataDir);
  }

  // create database.sqlite file
  const dbPath = path.resolve(dataDir, 'database.sqlite');
  if (fs.existsSync(dbPath)) {
    console.log('database.sqlite file already exists. skipping...');
  } else {
    fs.writeFileSync(dbPath, '');
  }
}

renameEnv();
createDB();
