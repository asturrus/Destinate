# CI/CD Test Output Capture

This directory stores the output of all CI/CD test runs with automatic build numbering.

## How It Works

The `run-ci-with-output.js` script:
1. Automatically increments the build number for each run
2. Captures all test output (stdout and stderr)
3. Saves everything to a timestamped file with the build number
4. Displays the output in real-time while saving it

## Usage

Run any test command through the wrapper:

```bash
# Run standard tests
node scripts/run-ci-with-output.js "npm test"

# Run all tests (unit + e2e)
node scripts/run-ci-with-output.js "npm run test:all"

# Run e2e tests only
node scripts/run-ci-with-output.js "npm run test:e2e"

# Run any other command
node scripts/run-ci-with-output.js "npm run test:coverage"
```

## Output Files

Each test run creates a file with the format:
```
ci-build-{number}-{timestamp}.txt
```

Example: `ci-build-5-2024-11-15T23-30-45.txt`

Each file contains:
- Build number
- Start/end timestamps
- Command that was run
- Full console output
- Exit code
- Duration

## Build Counter

The current build number is stored in `build-counter.txt` and automatically increments with each run.

## Example Output File

```
========================================
CI Build #5
Started: 2024-11-15T23:30:45.123Z
Command: npm test
========================================

[... full test output ...]

========================================
Build #5 finished
Exit code: 0
Duration: 12.45s
Ended: 2024-11-15T23:30:57.567Z
========================================
```

## Tips

- All output files are gitignored by default
- Build numbers persist across sessions
- To reset the build counter, edit `build-counter.txt` or delete it
- Files are saved in chronological order for easy review
