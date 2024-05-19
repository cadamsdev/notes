import core from '@actions/core';
import { execSync } from 'child_process';
import path from 'path';
import { readFileSync } from 'fs';

const label = process.argv.slice(2)?.toString()?.trim();

function main() {
  core.info(`Selected label: ${label}`);
  switch (label) {
    case 'major':
    case 'minor':
    case 'patch':
      bumpVersion(label);
      break;
    default:
      core.setFailed(`Invalid label: ${label}`);
      return;
  }
}

function bumpVersion(label) {
  try {
    // increment the package.json and creates a git tag
    core.info(`Incrementing version with label: ${label}`);
    execSync(`npm version ${label} -w web`, {
      stdio: 'inherit',
    });

    const newVersion = getVersion();
    const formattedVersion = getFormattedVersion(newVersion);
    outputFormattedVersion(formattedVersion);
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m "Publish version ${newVersion}"`, {
      stdio: 'inherit',
    });
    execSync(`git tag -a v${newVersion} -m "Bump version to ${newVersion}"`, {
      stdio: 'inherit',
    });
  } catch (error) {
    core.setFailed(`Failed to increment version: ${error.message}`);
  }
}

function getVersion() {
  const packageJsonPath = path.join(
    process.cwd(),
    'apps',
    'web-app',
    'package.json'
  );
  core.info(`Reading package.json from: ${packageJsonPath}`);
  const data = readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(data);
  return packageJson.version;
}

function getFormattedVersion(version) {
  const [major, minor, patch] = version.split('.');

  if (patch === '0') {
    return `${major}.${minor}`;
  }

  return `${major}.${minor}.${patch}`;
}

function outputFormattedVersion(formattedVersion) {
  core.info(`Formatted version: ${formattedVersion}`);
  core.setOutput('formatted_version', formattedVersion);
}

main();
