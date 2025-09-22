#!/usr/bin/env node

/**
 * Optimized lint-staged script that processes files in smaller chunks
 * to prevent memory issues and SIGKILL errors
 */

import { execSync } from 'child_process';

// Get the list of staged files from git
function getStagedFiles() {
  try {
    const output = execSync(
      'git diff --cached --name-only --diff-filter=ACMR',
      {
        encoding: 'utf8',
        stdio: 'pipe',
      }
    );
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting staged files:', error.message);
    return [];
  }
}

// Group files by type
function groupFilesByType(files) {
  const groups = {
    typescript: [],
    javascript: [],
    other: [],
  };

  files.forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      groups.typescript.push(file);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      groups.javascript.push(file);
    } else if (
      file.endsWith('.json') ||
      file.endsWith('.md') ||
      file.endsWith('.yml') ||
      file.endsWith('.yaml')
    ) {
      groups.other.push(file);
    }
  });

  return groups;
}

// Process files in chunks to prevent memory issues
function processFilesInChunks(files, command, chunkSize = 10) {
  if (files.length === 0) return true;

  console.log(`Processing ${files.length} files with command: ${command}`);

  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    const fileList = chunk.join(' ');

    try {
      console.log(
        `Processing chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(files.length / chunkSize)} (${chunk.length} files)`
      );
      execSync(`${command} ${fileList}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
    } catch (error) {
      console.error(`Error processing chunk:`, error.message);
      return false;
    }
  }

  return true;
}

// Main execution
function main() {
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log('No staged files to process');
    return;
  }

  const fileGroups = groupFilesByType(stagedFiles);
  let hasErrors = false;

  // Process TypeScript files
  if (fileGroups.typescript.length > 0) {
    console.log(
      `\n🔍 Linting ${fileGroups.typescript.length} TypeScript files...`
    );
    if (
      !processFilesInChunks(
        fileGroups.typescript,
        'npx eslint --fix --max-warnings=0 --cache --cache-location=node_modules/.cache/eslint'
      )
    ) {
      hasErrors = true;
    }
  }

  // Process JavaScript files
  if (fileGroups.javascript.length > 0) {
    console.log(
      `\n🔍 Linting ${fileGroups.javascript.length} JavaScript files...`
    );
    if (
      !processFilesInChunks(
        fileGroups.javascript,
        'npx eslint --fix --max-warnings=0 --cache --cache-location=node_modules/.cache/eslint'
      )
    ) {
      hasErrors = true;
    }
  }

  // Process other files with Prettier
  if (fileGroups.other.length > 0) {
    console.log(`\n🎨 Formatting ${fileGroups.other.length} other files...`);
    if (!processFilesInChunks(fileGroups.other, 'npx prettier --write')) {
      hasErrors = true;
    }
  }

  // Format TypeScript and JavaScript files with Prettier
  const codeFiles = [...fileGroups.typescript, ...fileGroups.javascript];
  if (codeFiles.length > 0) {
    console.log(`\n🎨 Formatting ${codeFiles.length} code files...`);
    if (!processFilesInChunks(codeFiles, 'npx prettier --write')) {
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\n❌ Lint-staged failed with errors');
    process.exit(1);
  } else {
    console.log('\n✅ All files processed successfully');
  }
}

main();
