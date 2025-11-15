#!/bin/bash

# Simple test script to demonstrate CI output capture

echo "Testing CI output capture system..."
echo ""

# Test with a simple echo command
echo "Running test with simple command..."
node scripts/run-ci-with-output.js "echo 'Test successful!'"

echo ""
echo "Checking generated files..."
ls -lh ci-results/

echo ""
echo "Latest build output:"
cat ci-results/ci-build-*.txt | tail -20
