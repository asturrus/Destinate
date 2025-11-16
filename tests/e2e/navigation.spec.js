import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:5000';

async function testNavigation() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  End-to-End Navigation Test Suite               ║');
  console.log('║  Testing all navigation links and routing       ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Navigate to home page
    console.log('Test 1: Load home page');
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="text-logo"]');
    const logo = await page.textContent('[data-testid="text-logo"]');
    if (logo.includes('Destinate')) {
      console.log('✓ Home page loaded successfully');
    } else {
      throw new Error('Logo not found on home page');
    }

    // Test 2: Click Forum navigation link
    console.log('\nTest 2: Navigate to Forum page');
    await page.click('[data-testid="link-nav-forum"]');
    await page.waitForSelector('[data-testid="forum-hero"]');
    const forumHeading = await page.isVisible('[data-testid="forum-hero"]');
    if (forumHeading) {
      console.log('✓ Forum page loaded successfully');
    } else {
      throw new Error('Forum page did not load');
    }

    // Test 3: Click logo to return home
    console.log('\nTest 3: Click logo to return to home');
    await page.click('[data-testid="text-logo"]');
    await page.waitForSelector('[data-testid="text-hero-title"]');
    const heroTitle = await page.isVisible('[data-testid="text-hero-title"]');
    if (heroTitle) {
      console.log('✓ Returned to home page via logo');
    } else {
      throw new Error('Did not return to home page');
    }

    // Test 4: Navigate to Sign In page
    console.log('\nTest 4: Navigate to Sign In page');
    await page.click('[data-testid="button-sign-in"]');
    await page.waitForURL('**/signin');
    const currentUrl = page.url();
    if (currentUrl.includes('/signin')) {
      console.log('✓ Sign In page loaded successfully');
    } else {
      throw new Error('Did not navigate to Sign In page');
    }

    // Test 5: Navigate back to home
    console.log('\nTest 5: Navigate back to home from Sign In');
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="text-hero-title"]');
    console.log('✓ Returned to home page');

    // Test 6: Click "Plan your trip" button
    console.log('\nTest 6: Navigate to Itineraries via "Plan your trip" button');
    await page.click('[data-testid="button-get-started"]');
    await page.waitForURL('**/itineraries');
    const itinerariesUrl = page.url();
    if (itinerariesUrl.includes('/itineraries')) {
      console.log('✓ Navigated to itineraries page');
    } else {
      throw new Error('Did not navigate to itineraries page');
    }

    // Test 7: Check itineraries page loads correctly
    console.log('\nTest 7: Verify itineraries page content');
    await page.waitForSelector('[data-testid="page-itineraries"]');
    const pageVisible = await page.isVisible('[data-testid="page-itineraries"]');
    if (pageVisible) {
      console.log('✓ Itineraries page content loaded');
    } else {
      throw new Error('Itineraries page content did not load');
    }

    // Test 8: Navigate to create itinerary page
    console.log('\nTest 8: Navigate to create itinerary page');
    const createButton = await page.$('[data-testid="button-create-itinerary"]');
    if (createButton) {
      await page.click('[data-testid="button-create-itinerary"]');
      await page.waitForURL('**/itineraries/create');
      const createUrl = page.url();
      if (createUrl.includes('/itineraries/create')) {
        console.log('✓ Navigated to create itinerary page');
      } else {
        throw new Error('Did not navigate to create page');
      }
    } else {
      console.log('⊘ Skipped - No existing itineraries to create from');
    }

    // Test 9: Test About section anchor navigation
    console.log('\nTest 9: Test anchor link navigation (About section)');
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="link-nav-about"]');
    await page.click('[data-testid="link-nav-about"]');
    await page.waitForTimeout(500); // Wait for scroll
    const aboutSection = await page.isVisible('[data-testid="section-about"]');
    if (aboutSection) {
      console.log('✓ Scrolled to About section via anchor link');
    } else {
      throw new Error('About section not visible after navigation');
    }

    // Test 10: Test Destinations anchor navigation
    console.log('\nTest 10: Test anchor link navigation (Destinations/Features section)');
    await page.click('[data-testid="link-nav-destinations"]');
    await page.waitForTimeout(500); // Wait for scroll
    const featuresSection = await page.isVisible('[data-testid="section-features"]');
    if (featuresSection) {
      console.log('✓ Scrolled to Features section via anchor link');
    } else {
      throw new Error('Features section not visible after navigation');
    }

    console.log('\n✅ All Navigation tests passed!\n');
    console.log('📊 Test Summary:');
    console.log('   - Home page navigation ✓');
    console.log('   - Forum page navigation ✓');
    console.log('   - Logo click navigation ✓');
    console.log('   - Sign In page navigation ✓');
    console.log('   - Itineraries page navigation ✓');
    console.log('   - Anchor link navigation ✓');
    console.log('   - Full navigation flow tested ✓\n');

  } catch (error) {
    console.error('\n❌ Navigation test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testNavigation().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
