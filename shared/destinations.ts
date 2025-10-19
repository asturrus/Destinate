// Destination data for the interactive map

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
  highlights: string[];
  bestTimeToVisit: string;
}

export const destinations: Destination[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    description: "Experience the perfect blend of traditional culture and cutting-edge technology in Japan's vibrant capital.",
    image: "/images/tokyo.jpg",
    highlights: [
      "Shibuya Crossing",
      "Senso-ji Temple",
      "Tokyo Skytree",
      "Tsukiji Fish Market",
      "Imperial Palace"
    ],
    bestTimeToVisit: "March to May, September to November"
  },
  {
    id: "venice",
    name: "Venice",
    country: "Italy",
    coordinates: { lat: 45.4408, lng: 12.3155 },
    description: "Discover the enchanting floating city with its romantic canals, stunning architecture, and rich artistic heritage.",
    image: "/images/venice.jpg",
    highlights: [
      "St. Mark's Basilica",
      "Grand Canal",
      "Rialto Bridge",
      "Doge's Palace",
      "Murano Glass Island"
    ],
    bestTimeToVisit: "April to June, September to November"
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    description: "The City of Light captivates with world-class museums, iconic landmarks, and unparalleled culinary experiences.",
    image: "/images/paris.jpg",
    highlights: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre-Dame Cathedral",
      "Arc de Triomphe",
      "Champs-Élysées"
    ],
    bestTimeToVisit: "April to June, September to November"
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    description: "Explore the historic capital where royal heritage meets modern innovation and multicultural charm.",
    image: "/images/london.jpg",
    highlights: [
      "Big Ben",
      "Tower of London",
      "British Museum",
      "Buckingham Palace",
      "London Eye"
    ],
    bestTimeToVisit: "May to September"
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    coordinates: { lat: 52.3676, lng: 4.9041 },
    description: "Cycle through picturesque canals, visit world-renowned museums, and embrace the laid-back Dutch lifestyle.",
    image: "/images/amsterdam.jpg",
    highlights: [
      "Anne Frank House",
      "Van Gogh Museum",
      "Canal Ring",
      "Rijksmuseum",
      "Vondelpark"
    ],
    bestTimeToVisit: "April to May, September to November"
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    coordinates: { lat: 36.3932, lng: 25.4615 },
    description: "Marvel at stunning sunsets, white-washed buildings, and crystal-clear waters in this Aegean paradise.",
    image: "/images/santorini.jpg",
    highlights: [
      "Oia Sunset",
      "Red Beach",
      "Ancient Akrotiri",
      "Fira Town",
      "Wine Tasting Tours"
    ],
    bestTimeToVisit: "April to November"
  }
];
