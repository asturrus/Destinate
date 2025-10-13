export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  image: string;
  bestTimeToVisit: string;
  avgTemperature: string;
  highlights: string[];
  travelTips: string[];
}

export const destinations: Destination[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    description: 'A vibrant metropolis where ancient traditions blend seamlessly with cutting-edge technology. Experience the neon-lit streets of Shibuya, serene temples, and world-class cuisine.',
    image: '/api/placeholder/800/600',
    bestTimeToVisit: 'March - May, September - November',
    avgTemperature: '15°C (59°F)',
    highlights: [
      'Senso-ji Temple',
      'Tokyo Skytree',
      'Shibuya Crossing',
      'Tsukiji Fish Market',
      'Imperial Palace'
    ],
    travelTips: [
      'Get a JR Pass for unlimited train travel',
      'Learn basic Japanese phrases',
      'Visit during cherry blossom season for spectacular views'
    ]
  },
  {
    id: 'venice',
    name: 'Venice',
    country: 'Italy',
    coordinates: { lat: 45.4408, lng: 12.3155 },
    description: 'The floating city of romance, famous for its intricate canal system, stunning architecture, and rich artistic heritage. Gondola rides and Renaissance art await.',
    image: '/api/placeholder/800/600',
    bestTimeToVisit: 'April - June, September - October',
    avgTemperature: '14°C (57°F)',
    highlights: [
      'St. Mark\'s Basilica',
      'Grand Canal',
      'Rialto Bridge',
      'Doge\'s Palace',
      'Murano Glass Factory'
    ],
    travelTips: [
      'Book gondola rides in advance',
      'Wear comfortable shoes for walking',
      'Visit lesser-known islands like Burano'
    ]
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    description: 'The City of Light captivates with its iconic landmarks, world-class museums, charming cafes, and unmatched elegance. Art, fashion, and gastronomy converge here.',
    image: '/api/placeholder/800/600',
    bestTimeToVisit: 'April - June, September - October',
    avgTemperature: '12°C (54°F)',
    highlights: [
      'Eiffel Tower',
      'Louvre Museum',
      'Notre-Dame Cathedral',
      'Arc de Triomphe',
      'Montmartre & Sacré-Cœur'
    ],
    travelTips: [
      'Book Eiffel Tower tickets weeks in advance',
      'Use the metro for easy navigation',
      'Enjoy café culture in Le Marais'
    ]
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    description: 'A global hub of culture, history, and modern innovation. From royal palaces to contemporary art galleries, London offers endless exploration.',
    image: '/api/placeholder/800/600',
    bestTimeToVisit: 'May - September',
    avgTemperature: '11°C (52°F)',
    highlights: [
      'Tower of London',
      'British Museum',
      'Buckingham Palace',
      'London Eye',
      'Big Ben & Parliament'
    ],
    travelTips: [
      'Get an Oyster card for public transport',
      'Many museums offer free admission',
      'Experience afternoon tea at a traditional venue'
    ]
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    coordinates: { lat: 52.3676, lng: 4.9041 },
    description: 'Picturesque canals, historic architecture, and a vibrant cultural scene define this charming city. Bike through tulip fields and explore world-renowned museums.',
    image: '/api/placeholder/800/600',
    bestTimeToVisit: 'April - May, September - November',
    avgTemperature: '10°C (50°F)',
    highlights: [
      'Anne Frank House',
      'Van Gogh Museum',
      'Canal Ring',
      'Rijksmuseum',
      'Keukenhof Gardens'
    ],
    travelTips: [
      'Rent a bike to explore like a local',
      'Book museums tickets online to skip lines',
      'Visit during tulip season for colorful displays'
    ]
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    coordinates: { lat: 36.3932, lng: 25.4615 },
    description: 'Iconic whitewashed buildings perched on dramatic cliffs overlooking the azure Aegean Sea. Witness breathtaking sunsets and indulge in Mediterranean cuisine.',
    image: '/api/placeholder/800/600',
    bestTimeToVisit: 'April - November',
    avgTemperature: '18°C (64°F)',
    highlights: [
      'Oia Sunset',
      'Red Beach',
      'Ancient Akrotiri',
      'Fira Town',
      'Wine Tasting Tours'
    ],
    travelTips: [
      'Book sunset dining reservations early',
      'Rent an ATV to explore the island',
      'Stay in Oia or Fira for best views'
    ]
  }
];

// Helper function to calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get random destination
export function getRandomDestination(excludeIds: string[] = []): Destination | null {
  const available = destinations.filter(d => !excludeIds.includes(d.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Calculate total trip distance
export function calculateTripDistance(destinationIds: string[]): number {
  if (destinationIds.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < destinationIds.length - 1; i++) {
    const dest1 = destinations.find(d => d.id === destinationIds[i]);
    const dest2 = destinations.find(d => d.id === destinationIds[i + 1]);
    
    if (dest1 && dest2) {
      totalDistance += calculateDistance(
        dest1.coordinates.lat,
        dest1.coordinates.lng,
        dest2.coordinates.lat,
        dest2.coordinates.lng
      );
    }
  }
  
  return Math.round(totalDistance);
}
