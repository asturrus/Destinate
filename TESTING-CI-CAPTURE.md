# Testing the CI Output Capture System

This document explains how to test the new CI output capture feature.

## Quick Test

To verify the system works, run:

```bash
node scripts/run-ci-with-output.js "echo 'Hello from CI Build System'"
```

This will:
1. Create a new build number
2. Run the echo command
3. Save all output to `ci-results/ci-build-{number}-{timestamp}.txt`
4. Display a summary when complete

## Running Real Tests

### Run unit tests with output capture:
```bash
node scripts/run-ci-with-output.js "npm test"
```

### Run all tests (unit + e2e) with output capture:
```bash
node scripts/run-ci-with-output.js "npm run test:all"
```

### Run e2e tests only with output capture:
```bash
node scripts/run-ci-with-output.js "npm run test:e2e"
```

## Viewing Results

All test outputs are saved in the `ci-results/` directory:

```bash
# List all build results
ls -lh ci-results/

# View the latest build
ls -t ci-results/ci-build-*.txt | head -1 | xargs cat

# View a specific build
cat ci-results/ci-build-1-2024-11-15T23-30-45.txt
```

## What Gets Captured

- All console output (stdout and stderr)
- Test results and summaries
- Error messages and stack traces
- Build metadata (number, timestamp, duration, exit code)

## Integration with CI/CD

You can integrate this into your CI/CD pipeline by calling the wrapper script instead of running tests directly. This will automatically create a historical record of all test runs.

## Resetting Build Counter

If you want to start over from build #1:

```bash
echo "0" > ci-results/build-counter.txt
```
