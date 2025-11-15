import { spawn } from 'child_process';

async function runTest(testFile) {
  return new Promise((resolve, reject) => {
    console.log(`\n--- Running ${testFile} ---\n`);
    
    const child = spawn('node', [testFile], {
      stdio: 'inherit', // Shows output in real-time
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${testFile} failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runAllTests() {
  const tests = [
    'tests/e2e/forum-hero.spec.js'
  ];
  
  console.log('=== Running All E2E Tests ===');
  
  let allPassed = true;
  
  for (const test of tests) {
    try {
      await runTest(test);
    } catch (error) {
      console.error(`\n${test} failed:`, error.message);
      allPassed = false;
    }
  }
  
  if (allPassed) {
    console.log('\nAll E2E tests passed!');
  } else {
    console.error('\nSome tests failed');
    process.exit(1);
  }
}

runAllTests();