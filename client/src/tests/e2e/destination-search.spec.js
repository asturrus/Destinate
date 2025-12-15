import { chromium } from 'playwright';

async function testDestinationSearch() {
  let browser;
  let page;
  
  try {
    console.log('Starting browser...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    console.log('Test 1: Search for all destinations (no query)');
    const allDestinations = await page.request.get('http://localhost:5000/api/destinations/search');
    const allData = await allDestinations.json();
    
    if (allData.length === 6) {
      console.log('✓ Returns all 6 destinations when no query provided');
    } else {
      throw new Error(`Expected 6 destinations, got ${allData.length}`);
    }
    
    console.log('Test 2: Search for "Paris"');
    const parisSearch = await page.request.get('http://localhost:5000/api/destinations/search?q=Paris');
    const parisData = await parisSearch.json();
    
    if (parisData.length === 1 && parisData[0].name === 'Paris') {
      console.log('✓ Returns Paris when searching for "Paris"');
    } else {
      throw new Error(`Expected Paris result, got ${JSON.stringify(parisData)}`);
    }
    
    console.log('Test 3: Search for "Japan" (country)');
    const japanSearch = await page.request.get('http://localhost:5000/api/destinations/search?q=Japan');
    const japanData = await japanSearch.json();
    
    if (japanData.length === 1 && japanData[0].country === 'Japan') {
      console.log('✓ Returns Tokyo when searching for "Japan"');
    } else {
      throw new Error(`Expected Japan result, got ${JSON.stringify(japanData)}`);
    }
    
    console.log('Test 4: Search with partial match "ven"');
    const veniceSearch = await page.request.get('http://localhost:5000/api/destinations/search?q=ven');
    const veniceData = await veniceSearch.json();
    
    if (veniceData.some(d => d.name === 'Venice')) {
      console.log('✓ Partial search works - found Venice');
    } else {
      throw new Error(`Expected Venice in results, got ${JSON.stringify(veniceData)}`);
    }
    
    console.log('Test 5: Search with no results');
    const noResults = await page.request.get('http://localhost:5000/api/destinations/search?q=Atlantis');
    const noData = await noResults.json();
    
    if (noData.length === 0) {
      console.log('✓ Returns empty array for non-existent destination');
    } else {
      throw new Error(`Expected 0 results, got ${noData.length}`);
    }
    
    console.log('\n✅ All Destination Search tests passed!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

console.log('Starting Destination Search tests...\n');
testDestinationSearch();
