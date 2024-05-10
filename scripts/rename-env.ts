import fs from 'fs';
import path from 'path';

const webAppDir = path.resolve(__dirname, '../', 'apps', 'web-app');
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
