// src/app/mock-data/mock-tourist-places.ts

import { TouristPlace } from "../Model/travel.models";

export const mockTouristPlaces: TouristPlace[] = [
  {
    id: 'fr1_id',
    placeId: 'fr1',
    countryId: 'fr',
    name: 'Eiffel Tower',
    description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
    imageUrl: '/assets/tourbook9.webp',
    cost: 125,
    rating: 4.7,
    highlights: ['Skip-the-line access', 'Panoramic city views', 'Restaurant dining'],
    bestTimeToVisit: 'Sunset',
    duration: '2-3 hours',
    accommodation: {
      hotelName: 'Hotel Paris View',
      roomType: 'Deluxe Suite',
      checkInDate: '2025-06-01',
      checkOutDate: '2025-06-03',
      numberOfRooms: 1,
      occupancyDetails: '2 adults',
      specialRequests: 'Eiffel Tower view room',
    },
    travelDetails: {
      transportationMode: 'Metro',
      travelDuration: '20 minutes',
      cost: 10,
    },
  },
  {
    id: 'fr1_id',
    placeId: 'fr1',
    countryId: 'fr',
    name: 'Eiffel Tower',
    description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
    imageUrl: '/assets/tourbook9.webp',
    cost: 125,
    rating: 4.7,
    highlights: ['Skip-the-line access', 'Panoramic city views', 'Restaurant dining'],
    bestTimeToVisit: 'Sunset',
    duration: '2-3 hours',
    accommodation: {
      hotelName: 'Hotel Paris View',
      roomType: 'Deluxe Suite',
      checkInDate: '2025-06-01',
      checkOutDate: '2025-06-03',
      numberOfRooms: 1,
      occupancyDetails: '2 adults',
      specialRequests: 'Eiffel Tower view room',
    },
    travelDetails: {
      transportationMode: 'Metro',
      travelDuration: '20 minutes',
      cost: 10,
    },
  },
  // Add other tourist places similarly...
];