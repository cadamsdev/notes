import core from '@actions/core';
import { execSync } from 'child_process';

try {
  execSync('git push --follow-tags', { stdio: 'inherit' });
} catch (error) {
  core.setFailed(`Failed to push changes: ${error.message}`);
}
