#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync, openSync, closeSync, unlinkSync } from 'fs';
import { join } from 'path';

const BUILD_COUNTER_FILE = 'ci-results/build-counter.txt';
const LOCK_FILE = 'ci-results/.build-lock';
const RESULTS_DIR = 'ci-results';
const MAX_LOCK_ATTEMPTS = 50;
const LOCK_RETRY_MS = 100;

// Ensure results directory exists
if (!existsSync(RESULTS_DIR)) {
  mkdirSync(RESULTS_DIR, { recursive: true });
}

// Acquire lock and increment build number atomically
function acquireLockAndIncrementBuild() {
  let attempts = 0;
  
  while (attempts < MAX_LOCK_ATTEMPTS) {
    try {
      // Try to create lock file exclusively (fails if exists)
      const fd = openSync(LOCK_FILE, 'wx');
      closeSync(fd);
      
      // Lock acquired - now read and increment counter
      let buildNumber = 1;
      try {
        if (existsSync(BUILD_COUNTER_FILE)) {
          const counterContent = readFileSync(BUILD_COUNTER_FILE, 'utf-8').trim();
          buildNumber = parseInt(counterContent, 10) + 1;
        }
      } catch (error) {
        console.log('Starting with build number 1');
      }
      
      // Write new counter value
      writeFileSync(BUILD_COUNTER_FILE, buildNumber.toString());
      
      // Release lock
      try {
        unlinkSync(LOCK_FILE);
      } catch (e) {
        // Lock file already removed, that's fine
      }
      
      return buildNumber;
    } catch (error) {
      if (error.code === 'EEXIST') {
        // Lock file exists, retry after delay
        attempts++;
        const jitter = Math.random() * 50; // Add jitter to prevent thundering herd
        const delay = LOCK_RETRY_MS + jitter;
        
        // Sleep synchronously
        const start = Date.now();
        while (Date.now() - start < delay) {
          // Busy wait
        }
      } else {
        throw error;
      }
    }
  }
  
  throw new Error('Failed to acquire lock after maximum attempts');
}

// Get build number
const buildNumber = acquireLockAndIncrementBuild();

// Create timestamp
const now = new Date();
const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
const outputFile = join(RESULTS_DIR, `ci-build-${buildNumber}-${timestamp}.txt`);

// Get test command from command line args
const testCommand = process.argv.slice(2).join(' ') || 'npm test';

console.log(`\n========================================`);
console.log(`CI Build #${buildNumber}`);
console.log(`Started: ${now.toISOString()}`);
console.log(`Command: ${testCommand}`);
console.log(`Output file: ${outputFile}`);
console.log(`========================================\n`);

// Create header for output file
const header = `
========================================
CI Build #${buildNumber}
Started: ${now.toISOString()}
Command: ${testCommand}
========================================

`;

writeFileSync(outputFile, header);

// Run the test command and capture output
// Pass full command to shell to handle complex quoting correctly
const child = spawn(testCommand, {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

// Capture stdout
child.stdout.on('data', (data) => {
  const text = data.toString();
  process.stdout.write(text);
  try {
    appendFileSync(outputFile, text);
  } catch (error) {
    console.error('Failed to write to output file:', error.message);
  }
});

// Capture stderr
child.stderr.on('data', (data) => {
  const text = data.toString();
  process.stderr.write(text);
  try {
    appendFileSync(outputFile, text);
  } catch (error) {
    console.error('Failed to write to output file:', error.message);
  }
});

// Handle process errors
child.on('error', (error) => {
  const errorText = `\nProcess error: ${error.message}\n`;
  console.error(errorText);
  try {
    appendFileSync(outputFile, errorText);
  } catch (e) {
    console.error('Failed to write error to output file:', e.message);
  }
  process.exit(1);
});

// Handle completion
child.on('close', (code) => {
  const endTime = new Date();
  const duration = ((endTime - now) / 1000).toFixed(2);
  
  const footer = `
\n========================================
Build #${buildNumber} finished
Exit code: ${code}
Duration: ${duration}s
Ended: ${endTime.toISOString()}
========================================
`;

  try {
    appendFileSync(outputFile, footer);
  } catch (error) {
    console.error('Failed to write footer to output file:', error.message);
  }
  
  console.log(footer);
  console.log(`Full output saved to: ${outputFile}\n`);
  
  process.exit(code || 0);
});
