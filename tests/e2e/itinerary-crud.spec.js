import { chromium } from 'playwright';

async function testItineraryCRUD() {
  let browser;
  let page;
  
  try {
    console.log('Starting browser...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    console.log('Test 1: Navigate to itineraries page');
    await page.goto('http://localhost:5000/itineraries');
    await page.waitForSelector('[data-testid="itineraries-page"]', { timeout: 5000 });
    console.log('✓ Successfully loaded itineraries page');
    
    console.log('\nTest 2: Create a new itinerary through the UI');
    await page.click('[data-testid="button-create-itinerary"]');
    await page.waitForSelector('[data-testid="create-itinerary-page"]', { timeout: 5000 });
    console.log('✓ Navigated to create itinerary page');
    
    await page.fill('[data-testid="input-title"]', 'European Adventure');
    await page.fill('[data-testid="input-description"]', 'A 2-week tour of Europe');
    console.log('✓ Filled in title and description');
    
    await page.click('[data-testid="select-destination"]');
    await page.waitForSelector('[data-testid="destination-option-paris"]', { timeout: 2000 });
    await page.click('[data-testid="destination-option-paris"]');
    await page.click('[data-testid="button-add-destination"]');
    console.log('✓ Added Paris to destinations');
    
    await page.click('[data-testid="select-destination"]');
    await page.waitForSelector('[data-testid="destination-option-venice"]', { timeout: 2000 });
    await page.click('[data-testid="destination-option-venice"]');
    await page.click('[data-testid="button-add-destination"]');
    console.log('✓ Added Venice to destinations');
    
    const selectedDestinations = await page.locator('[data-testid="selected-destinations"]');
    const destinationCount = await selectedDestinations.locator('[data-testid^="selected-destination-"]').count();
    if (destinationCount !== 2) {
      throw new Error(`Expected 2 destinations, but found ${destinationCount}`);
    }
    console.log('✓ Verified 2 destinations are selected');
    
    await page.click('[data-testid="button-submit"]');
    console.log('✓ Submitted the form');
    
    console.log('\nTest 3: Verify itinerary was created and appears in list');
    await page.waitForSelector('[data-testid="itineraries-page"]', { timeout: 5000 });
    console.log('✓ Redirected back to itineraries list page');
    
    await page.waitForTimeout(1000);
    
    const hasGrid = await page.locator('[data-testid="itineraries-grid"]').isVisible().catch(() => false);
    const hasEmptyState = await page.locator('[data-testid="empty-state"]').isVisible().catch(() => false);
    
    if (!hasGrid && hasEmptyState) {
      throw new Error('Expected itinerary grid but found empty state - itinerary may not have been created');
    }
    
    if (!hasGrid) {
      throw new Error('Neither itinerary grid nor empty state found on page');
    }
    console.log('✓ Found itineraries grid');
    
    const itineraryCards = await page.locator('[data-testid^="itinerary-card-"]').all();
    if (itineraryCards.length === 0) {
      throw new Error('Expected at least 1 itinerary card, but found none');
    }
    console.log(`✓ Found ${itineraryCards.length} itinerary card(s) in the list`);
    
    const firstCard = itineraryCards[0];
    const titleText = await firstCard.locator('[data-testid^="itinerary-title-"]').textContent();
    if (!titleText.includes('European Adventure')) {
      throw new Error(`Expected title to contain 'European Adventure', but got '${titleText}'`);
    }
    console.log('✓ Verified itinerary title is displayed correctly');
    
    const descriptionText = await firstCard.locator('[data-testid^="itinerary-description-"]').textContent();
    if (!descriptionText.includes('A 2-week tour of Europe')) {
      throw new Error(`Expected description to contain 'A 2-week tour of Europe', but got '${descriptionText}'`);
    }
    console.log('✓ Verified itinerary description is displayed correctly');
    
    const destinationsText = await firstCard.locator('[data-testid^="itinerary-destinations-"]').textContent();
    if (!destinationsText.includes('2')) {
      throw new Error(`Expected 2 destinations, but got '${destinationsText}'`);
    }
    console.log('✓ Verified itinerary shows 2 destinations');
    
    console.log('\nTest 4: View itinerary details');
    const firstItineraryId = (await firstCard.getAttribute('data-testid')).replace('itinerary-card-', '');
    console.log(`  Navigating to: http://localhost:5000/itineraries/${firstItineraryId}`);
    await page.goto(`http://localhost:5000/itineraries/${firstItineraryId}`);
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    console.log(`  Current URL: ${currentUrl}`);
    
    const hasDetailPage = await page.locator('[data-testid="itinerary-detail-page"]').isVisible().catch(() => false);
    const hasNotFound = await page.locator('text=not found').isVisible().catch(() => false);
    
    if (hasNotFound) {
      throw new Error('Itinerary detail page returned "not found" - the itinerary might not exist');
    }
    
    if (!hasDetailPage) {
      const bodyText = await page.locator('body').textContent();
      throw new Error(`Detail page not found. Body text: ${bodyText.substring(0, 200)}`);
    }
    
    console.log('✓ Navigated to itinerary detail page');
    
    const detailTitle = await page.locator('[data-testid="itinerary-title"]').textContent();
    if (!detailTitle.includes('European Adventure')) {
      throw new Error(`Expected detail title to be 'European Adventure', but got '${detailTitle}'`);
    }
    console.log('✓ Verified detail page title');
    
    const destinationsList = await page.locator('[data-testid="destinations-list"]');
    const destinationItems = await destinationsList.locator('[data-testid^="destination-item-"]').all();
    if (destinationItems.length !== 2) {
      throw new Error(`Expected 2 destination items, but found ${destinationItems.length}`);
    }
    console.log('✓ Verified detail page shows 2 destinations');
    
    const parisName = await destinationsList.locator('[data-testid="destination-name-paris"]').textContent();
    if (!parisName.includes('Paris')) {
      throw new Error(`Expected destination name 'Paris', but got '${parisName}'`);
    }
    console.log('✓ Verified Paris is in the destinations list');
    
    const veniceCountry = await destinationsList.locator('[data-testid="destination-country-venice"]').textContent();
    if (!veniceCountry.includes('Italy')) {
      throw new Error(`Expected destination country 'Italy', but got '${veniceCountry}'`);
    }
    console.log('✓ Verified Venice shows correct country');
    
    console.log('\nTest 5: Navigate back and create second itinerary');
    await page.click('[data-testid="button-back"]');
    await page.waitForSelector('[data-testid="itineraries-page"]', { timeout: 5000 });
    console.log('✓ Navigated back to itineraries list');
    
    await page.click('[data-testid="button-create-itinerary"]');
    await page.waitForSelector('[data-testid="create-itinerary-page"]', { timeout: 5000 });
    
    await page.fill('[data-testid="input-title"]', 'Asian Journey');
    await page.click('[data-testid="select-destination"]');
    await page.waitForSelector('[data-testid="destination-option-tokyo"]', { timeout: 2000 });
    await page.click('[data-testid="destination-option-tokyo"]');
    await page.click('[data-testid="button-add-destination"]');
    
    await page.click('[data-testid="button-submit"]');
    await page.waitForSelector('[data-testid="itineraries-page"]', { timeout: 5000 });
    console.log('✓ Created second itinerary');
    
    console.log('\nTest 6: Verify both itineraries exist');
    const allCards = await page.locator('[data-testid^="itinerary-card-"]').all();
    if (allCards.length < 2) {
      throw new Error(`Expected at least 2 itinerary cards, but found ${allCards.length}`);
    }
    console.log(`✓ Verified ${allCards.length} itineraries exist in storage`);
    
    console.log('\nTest 7: Delete first itinerary through UI');
    page.once('dialog', dialog => dialog.accept());
    
    const firstItineraryCard = allCards[0];
    await firstItineraryCard.locator('[data-testid^="button-delete-"]').click();
    
    await page.waitForTimeout(1000);
    console.log('✓ Clicked delete button and confirmed');
    
    console.log('\nTest 8: Verify itinerary was deleted');
    const remainingCards = await page.locator('[data-testid^="itinerary-card-"]').all();
    if (remainingCards.length >= allCards.length) {
      throw new Error(`Expected fewer cards after deletion, but still have ${remainingCards.length}`);
    }
    console.log(`✓ Verified itinerary was deleted (${remainingCards.length} remaining)`);
    
    console.log('\nTest 9: Test form validation - try to submit without destinations');
    await page.click('[data-testid="button-create-itinerary"]');
    await page.waitForSelector('[data-testid="create-itinerary-page"]', { timeout: 5000 });
    
    await page.fill('[data-testid="input-title"]', 'Missing Destinations');
    await page.click('[data-testid="button-submit"]');
    
    await page.waitForTimeout(500);
    
    const stillOnCreatePage = await page.locator('[data-testid="create-itinerary-page"]').isVisible();
    if (!stillOnCreatePage) {
      throw new Error('Expected to stay on create page when validation fails, but was redirected');
    }
    console.log('✓ Form validation prevented submission without destinations');
    
    console.log('\n✅ All End-to-End Itinerary CRUD tests passed!\n');
    console.log('📊 Test Summary:');
    console.log('   - Created itinerary through UI ✓');
    console.log('   - Verified data persistence ✓');
    console.log('   - Viewed itinerary details ✓');
    console.log('   - Deleted itinerary ✓');
    console.log('   - Validated form inputs ✓');
    console.log('   - Full user journey tested ✓\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

console.log('╔══════════════════════════════════════════════════╗');
console.log('║  End-to-End Itinerary CRUD Test Suite          ║');
console.log('║  Testing complete user journey through the UI   ║');
console.log('╚══════════════════════════════════════════════════╝\n');
testItineraryCRUD();
