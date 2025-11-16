import { chromium } from 'playwright';

async function testItineraryCRUD() {
  let browser;
  let page;
  let createdItineraryId;
  
  try {
    console.log('Starting browser...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    // Test 1: Create itinerary
    console.log('Test 1: Create a new itinerary via POST /api/itineraries');
    const createResponse = await page.request.post('http://localhost:5000/api/itineraries', {
      data: {
        title: 'European Adventure',
        description: 'A 2-week tour of Europe',
        destinations: [
          { id: 'paris', name: 'Paris', country: 'France' },
          { id: 'venice', name: 'Venice', country: 'Italy' }
        ]
      }
    });
    
    if (createResponse.status() !== 201) {
      throw new Error(`Expected 201, got ${createResponse.status()}`);
    }
    
    const createdItinerary = await createResponse.json();
    createdItineraryId = createdItinerary.id;
    
    if (createdItinerary.title === 'European Adventure' && createdItinerary.destinations.length === 2) {
      console.log('✓ Itinerary created successfully with correct data');
    } else {
      throw new Error(`Unexpected itinerary data: ${JSON.stringify(createdItinerary)}`);
    }
    
    // Test 2: Retrieve the created itinerary
    console.log('Test 2: Retrieve itinerary via GET /api/itineraries/:id');
    const getResponse = await page.request.get(`http://localhost:5000/api/itineraries/${createdItineraryId}`);
    
    if (getResponse.status() !== 200) {
      throw new Error(`Expected 200, got ${getResponse.status()}`);
    }
    
    const retrievedItinerary = await getResponse.json();
    
    if (retrievedItinerary.id === createdItineraryId && retrievedItinerary.title === 'European Adventure') {
      console.log('✓ Itinerary retrieved successfully - data persisted');
    } else {
      throw new Error(`Retrieved data doesn't match: ${JSON.stringify(retrievedItinerary)}`);
    }
    
    // Test 3: Get all itineraries
    console.log('Test 3: Get all itineraries via GET /api/itineraries');
    const allResponse = await page.request.get('http://localhost:5000/api/itineraries');
    
    if (allResponse.status() !== 200) {
      throw new Error(`Expected 200, got ${allResponse.status()}`);
    }
    
    const allItineraries = await allResponse.json();
    
    if (Array.isArray(allItineraries) && allItineraries.length >= 1) {
      console.log(`✓ Retrieved ${allItineraries.length} itinerary/itineraries`);
    } else {
      throw new Error(`Expected array with at least 1 itinerary, got ${JSON.stringify(allItineraries)}`);
    }
    
    // Test 4: Create second itinerary to verify multiple storage
    console.log('Test 4: Create second itinerary');
    const createResponse2 = await page.request.post('http://localhost:5000/api/itineraries', {
      data: {
        title: 'Asian Journey',
        description: 'Exploring the Far East',
        destinations: [
          { id: 'tokyo', name: 'Tokyo', country: 'Japan' },
          { id: 'bali', name: 'Bali', country: 'Indonesia' }
        ]
      }
    });
    
    const createdItinerary2 = await createResponse2.json();
    
    if (createResponse2.status() === 201) {
      console.log('✓ Second itinerary created successfully');
    }
    
    // Test 5: Verify both exist
    console.log('Test 5: Verify both itineraries exist in storage');
    const allResponse2 = await page.request.get('http://localhost:5000/api/itineraries');
    const allItineraries2 = await allResponse2.json();
    
    if (allItineraries2.length >= 2) {
      console.log(`✓ Found ${allItineraries2.length} itineraries in storage`);
    } else {
      throw new Error(`Expected at least 2 itineraries, got ${allItineraries2.length}`);
    }
    
    // Test 6: Delete itinerary
    console.log('Test 6: Delete itinerary via DELETE /api/itineraries/:id');
    const deleteResponse = await page.request.delete(`http://localhost:5000/api/itineraries/${createdItineraryId}`);
    
    if (deleteResponse.status() !== 204) {
      throw new Error(`Expected 204, got ${deleteResponse.status()}`);
    }
    
    console.log('✓ Itinerary deleted successfully');
    
    // Test 7: Verify deletion
    console.log('Test 7: Verify itinerary no longer exists');
    const getAfterDelete = await page.request.get(`http://localhost:5000/api/itineraries/${createdItineraryId}`);
    
    if (getAfterDelete.status() === 404) {
      console.log('✓ Deleted itinerary returns 404 as expected');
    } else {
      throw new Error(`Expected 404 after deletion, got ${getAfterDelete.status()}`);
    }
    
    // Test 8: Test validation error
    console.log('Test 8: Test validation error with invalid data');
    const invalidResponse = await page.request.post('http://localhost:5000/api/itineraries', {
      data: {
        title: 'Missing Destinations'
        // Missing required destinations field
      }
    });
    
    if (invalidResponse.status() === 400) {
      console.log('✓ Validation error returns 400 as expected');
    } else {
      throw new Error(`Expected 400 for invalid data, got ${invalidResponse.status()}`);
    }
    
    console.log('\n✅ All Itinerary CRUD tests passed!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

console.log('Starting Itinerary CRUD tests...\n');
testItineraryCRUD();
