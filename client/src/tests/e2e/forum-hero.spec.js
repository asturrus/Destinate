import { chromium } from 'playwright';

async function testForumHero() {
  let browser;
  let page;
  
  try {
    console.log('1. Starting browser...');
    browser = await chromium.launch({ headless: true });
    
    console.log('2. Creating new page...');
    page = await browser.newPage();
    
    console.log('3. Navigating to http://localhost:5000/forum');
    await page.goto('http://localhost:5000/forum');
    
    console.log('4. Looking for forum-hero element...');
    const forumHero = page.locator('[data-testid="forum-hero"]');
    await forumHero.waitFor({ timeout: 5000 });
    console.log('✓ ForumHero component renders');
    
    // Test search input
    console.log('5. Testing search input...');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Paris');
    const inputValue = await searchInput.inputValue();
    if (inputValue === 'Paris') {
      console.log('✓ Search input accepts text input');
    }
    
    // Test search button
    const searchButton = page.locator('[data-testid="search-button"]');
    const buttonText = await searchButton.textContent();
    if (buttonText === 'Enter') {
      console.log('✓ Search button displays correct text');
    }
    
    // Test destinations grid
    const destinationsGrid = page.locator('[data-testid="destinations-grid"]');
    await destinationsGrid.waitFor();
    console.log('✓ Destinations grid renders');
    
    // Count destination cards
    const cards = page.locator('[data-testid^="destination-card-"]');
    const count = await cards.count();
    if (count === 6) {
      console.log('✓ All 6 destination cards render');
    } else {
      throw new Error(`Expected 6 cards, found ${count}`);
    }
    
    // Check first card
    const firstCard = page.locator('[data-testid="destination-card-0"]');
    const cardText = await firstCard.textContent();
    if (cardText.includes('Tokyo')) {
      console.log('✓ Destination cards display correct text');
    }
    
    console.log('\n✅ All ForumHero tests passed!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

console.log('Starting ForumHero tests...\n');
testForumHero();