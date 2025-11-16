import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:5000';

async function testForumFunctionality() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  End-to-End Forum Functionality Test Suite      ║');
  console.log('║  Testing forum features and user interactions   ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Navigate to forum page
    console.log('Test 1: Navigate to forum page');
    await page.goto(`${BASE_URL}/forum`);
    await page.waitForSelector('[data-testid="forum-hero"]');
    console.log('✓ Forum page loaded successfully');

    // Test 2: Verify search functionality exists
    console.log('\nTest 2: Verify search components exist');
    const searchInput = await page.isVisible('[data-testid="search-input"]');
    const searchButton = await page.isVisible('[data-testid="search-button"]');
    if (searchInput && searchButton) {
      console.log('✓ Search input and button are visible');
    } else {
      throw new Error('Search components not found');
    }

    // Test 3: Verify popular destinations display
    console.log('\nTest 3: Verify popular destinations display');
    await page.waitForSelector('[data-testid="destinations-grid"]');
    const destinationCards = await page.$$('[data-testid^="destination-card-"]');
    if (destinationCards.length === 6) {
      console.log(`✓ Found ${destinationCards.length} destination cards`);
    } else {
      throw new Error(`Expected 6 destinations, found ${destinationCards.length}`);
    }

    // Test 4: Verify popular discussions section
    console.log('\nTest 4: Verify popular discussions section');
    await page.waitForSelector('[data-testid="section-popular-discussions"]');
    const discussionsHeading = await page.textContent('[data-testid="text-discussions-heading"]');
    if (discussionsHeading.includes('Popular Discussions')) {
      console.log('✓ Popular discussions section is visible');
    } else {
      throw new Error('Popular discussions heading not found');
    }

    // Test 5: Count initial discussions
    console.log('\nTest 5: Count existing discussions');
    const initialDiscussions = await page.$$('[data-testid="card-discussion"]');
    const initialCount = initialDiscussions.length;
    console.log(`✓ Found ${initialCount} existing discussions`);

    // Test 6: Click "New Post" button
    console.log('\nTest 6: Open new discussion form');
    await page.click('[data-testid="button-new-post"]');
    await page.waitForSelector('[data-testid="form-new-discussion"]');
    const formVisible = await page.isVisible('[data-testid="form-new-discussion"]');
    if (formVisible) {
      console.log('✓ New discussion form opened');
    } else {
      throw new Error('Form did not appear');
    }

    // Test 7: Create a new discussion
    console.log('\nTest 7: Create a new discussion post');
    await page.fill('[data-testid="input-discussion-title"]', 'Best coffee shops in Amsterdam?');
    await page.fill('[data-testid="input-discussion-author"]', 'TestUser');
    await page.click('[data-testid="button-post-discussion"]');
    
    // Wait a moment for the form to close and discussion to be added
    await page.waitForTimeout(500);
    
    // Verify form is closed
    const formHidden = !(await page.isVisible('[data-testid="form-new-discussion"]'));
    if (formHidden) {
      console.log('✓ Form closed after submission');
    } else {
      throw new Error('Form did not close');
    }

    // Test 8: Verify new discussion appears
    console.log('\nTest 8: Verify new discussion appears in list');
    const updatedDiscussions = await page.$$('[data-testid="card-discussion"]');
    const newCount = updatedDiscussions.length;
    if (newCount === initialCount + 1) {
      console.log(`✓ Discussion count increased from ${initialCount} to ${newCount}`);
    } else {
      throw new Error(`Expected ${initialCount + 1} discussions, found ${newCount}`);
    }

    // Verify the new discussion content
    const firstDiscussionTitle = await page.locator('[data-testid="card-discussion"]').first().locator('[data-testid="text-discussion-title"]').textContent();
    if (firstDiscussionTitle.includes('Best coffee shops in Amsterdam?')) {
      console.log('✓ New discussion appears with correct title');
    } else {
      throw new Error('New discussion title not found');
    }

    // Test 9: Click on a discussion to view details
    console.log('\nTest 9: View discussion details');
    await page.locator('[data-testid="card-discussion"]').first().click();
    await page.waitForSelector('[data-testid="page-discussion-detail"]');
    const detailPageVisible = await page.isVisible('[data-testid="page-discussion-detail"]');
    if (detailPageVisible) {
      console.log('✓ Discussion detail page opened');
    } else {
      throw new Error('Detail page did not open');
    }

    // Test 10: Verify discussion details
    console.log('\nTest 10: Verify discussion detail content');
    const detailTitle = await page.textContent('[data-testid="text-discussion-detail-title"]');
    const detailAuthor = await page.textContent('[data-testid="text-discussion-detail-author"]');
    const detailDate = await page.textContent('[data-testid="text-discussion-detail-date"]');
    
    if (detailTitle.includes('Best coffee shops in Amsterdam?') && 
        detailAuthor.includes('TestUser')) {
      console.log('✓ Discussion details displayed correctly');
      console.log(`  Title: ${detailTitle}`);
      console.log(`  Author: ${detailAuthor}`);
    } else {
      throw new Error('Discussion details incomplete');
    }

    // Test 11: Navigate back to discussions list
    console.log('\nTest 11: Navigate back to discussions list');
    await page.click('[data-testid="button-back-to-discussions"]');
    await page.waitForSelector('[data-testid="grid-discussions"]');
    const backToList = await page.isVisible('[data-testid="grid-discussions"]');
    if (backToList) {
      console.log('✓ Returned to discussions list');
    } else {
      throw new Error('Did not return to discussions list');
    }

    // Test 12: Verify discussion still exists after navigation
    console.log('\nTest 12: Verify discussion persists after navigation');
    const finalDiscussions = await page.$$('[data-testid="card-discussion"]');
    if (finalDiscussions.length === newCount) {
      console.log('✓ Discussion persists after navigation');
    } else {
      throw new Error('Discussion count changed unexpectedly');
    }

    console.log('\n✅ All Forum Functionality tests passed!\n');
    console.log('📊 Test Summary:');
    console.log('   - Forum page loads correctly ✓');
    console.log('   - Search components present ✓');
    console.log('   - Popular destinations displayed ✓');
    console.log('   - Discussions list displayed ✓');
    console.log('   - New discussion form works ✓');
    console.log('   - Discussion creation successful ✓');
    console.log('   - Discussion detail view works ✓');
    console.log('   - Navigation between views works ✓');
    console.log('   - Data persistence verified ✓\n');

  } catch (error) {
    console.error('\n❌ Forum functionality test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testForumFunctionality().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
