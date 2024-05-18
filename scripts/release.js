const core = require('@actions/core');
const { execSync } = require('child_process');

function incrementSemver(label) {
  try {
    // increment the package.json
    // creates a tag
    // commits the changes
    execSync(`npm version ${label} -m "Publish version %s"`, {
      stdio: 'inherit',
    });

    // push the changes
    execSync('git push --follow-tags', { stdio: 'inherit' });
  } catch (error) {
    core.setFailed(`Failed to increment version: ${error.message}`);
  }
}

function deploy() {
  const label = process.argv.slice(2)?.toString()?.trim();
  core.info(`Selected label: ${label}`);
  switch (label) {
    case 'major':
    case 'minor':
    case 'patch':
      incrementSemver(label);
      break;
    default:
      core.setFailed(`Invalid label: ${label}`);
      return;
  }
}

deploy();
