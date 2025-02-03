import { TouristPlace } from '../Model/travel.models';

export const mockTouristPlaces: TouristPlace[] = [
  {
    id: 'fr1_id',
    placeId: 'eiffel_tower',
    countryId: 'fr',
    name: 'Eiffel Tower',
    description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
    imageUrl: '/assets/tourbook9.webp',
    cost: 125,
    rating: 4.7,
    highlights: [
      'Skip-the-line access',
      'Panoramic city views',
      'Restaurant dining',
    ],
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
    touristGuideDetails: {
      guideName: 'Jacques Dupont',
      experience: '8 years',
      languagesSpoken: ['English', 'French'],
      contactNumber: '+33 1 23 45 67 89',
      specialization: ['Historical tours', 'Photography spots']
    }
  },
  {
    id: 'fr2_id',
    placeId: 'louvre_museum',
    countryId: 'fr',
    name: 'Louvre Museum',
    description: 'World\'s largest art museum and a historic monument in Paris.',
    imageUrl: '/assets/tourbook8.webp',
    cost: 65,
    rating: 4.8,
    highlights: ['Mona Lisa', 'Venus de Milo', 'Guided tours'],
    bestTimeToVisit: 'Morning',
    duration: '4-5 hours',
    accommodation: {
      hotelName: 'Louvre Hotel',
      roomType: 'Superior Room',
      checkInDate: '2025-06-05',
      checkOutDate: '2025-06-07',
      numberOfRooms: 1,
      occupancyDetails: '2 adults',
      specialRequests: 'Close to the museum',
    },
    travelDetails: {
      transportationMode: 'Walking',
      travelDuration: '5 minutes',
      cost: 0,
    },
    touristGuideDetails: {
      guideName: 'Marie Lavigne',
      experience: '12 years',
      languagesSpoken: ['English', 'French', 'Spanish'],
      contactNumber: '+33 1 98 76 54 32',
      specialization: ['Art history', 'Museum tours']
    }
  },
  {
    id: 'fr3_id',
    placeId: 'notre_dame',
    countryId: 'fr',
    name: 'Notre-Dame Cathedral',
    description: 'Famous medieval Catholic cathedral on the Île de la Cité.',
    imageUrl: '/assets/tourbook5.webp',
    cost: 30,
    rating: 4.6,
    highlights: ['Architectural tours', 'Bell towers', 'Crypt'],
    bestTimeToVisit: 'Spring',
    duration: '2-3 hours',
    accommodation: {
      hotelName: 'Cité Hotel',
      roomType: 'Standard Room',
      checkInDate: '2025-06-10',
      checkOutDate: '2025-06-12',
      numberOfRooms: 1,
      occupancyDetails: '2 adults',
      specialRequests: 'Cathedral view room',
    },
    travelDetails: {
      transportationMode: 'Bus',
      travelDuration: '15 minutes',
      cost: 5,
    },
    touristGuideDetails: {
      guideName: 'Jean Valjean',
      experience: '5 years',
      languagesSpoken: ['English', 'French'],
      contactNumber: '+33 6 11 22 33 44',
      specialization: ['Architectural history', 'Religious sites']
    }
  },
  {
    id: 'fr4_id',
    placeId: 'versailles',
    countryId: 'fr',
    name: 'Palace of Versailles',
    description: 'Former royal residence located in Versailles.',
    imageUrl: '/assets/tourbook6.webp',
    cost: 55,
    rating: 4.7,
    highlights: ['Hall of Mirrors', 'Royal apartments', 'Gardens'],
    bestTimeToVisit: 'Spring',
    duration: '3-4 hours',
    accommodation: {
      hotelName: 'Versailles Park Hotel',
      roomType: 'Luxury Suite',
      checkInDate: '2025-06-15',
      checkOutDate: '2025-06-17',
      numberOfRooms: 1,
      occupancyDetails: '2 adults',
      specialRequests: 'Garden view room',
    },
    travelDetails: {
      transportationMode: 'Train',
      travelDuration: '30 minutes',
      cost: 10,
    },
    touristGuideDetails: {
      guideName: 'Louis XIV',
      experience: '15 years',
      languagesSpoken: ['English', 'French'],
      contactNumber: '+33 1 22 33 44 55',
      specialization: ['Royal history', 'Gardens']
    }
  },
  {
    id: 'fr5_id',
    placeId: 'mont_saint_michel',
    countryId: 'fr',
    name: 'Mont Saint-Michel',
    description: 'Island commune in Normandy, France.',
    imageUrl: '/assets/tourbook3.webp',
    cost: 60,
    rating: 4.8,
    highlights: ['Abbey', 'Tidal island', 'Guided tours'],
    bestTimeToVisit: 'Summer',
    duration: '4-5 hours',
    accommodation: {
      hotelName: 'Mont Saint-Michel Hotel',
      roomType: 'Classic Room',
      checkInDate: '2025-06-20',
      checkOutDate: '2025-06-22',
      numberOfRooms: 1,
      occupancyDetails: '2 adults',
      specialRequests: 'Abbey view room',
    },
    travelDetails: {
      transportationMode: 'Bus',
      travelDuration: '1 hour',
      cost: 15,
    },
    touristGuideDetails: {
      guideName: 'Pierre Dubois',
      experience: '9 years',
      languagesSpoken: ['English', 'French'],
      contactNumber: '+33 2 33 44 55 66',
      specialization: ['Medieval history', 'Island tours']
    }
  },
  {
    id: 'fr6_id',
    placeId: 'chateau_de_chenonceau',
    countryId: 'fr',
    name: 'Château de Chenonceau',
    description: 'Historic château spanning the River Cher in the Loire Valley.',
    imageUrl: '/assets/tourbook2.webp',
    cost: 50,
    rating: 4.7,
    highlights: ['Architectural tours', 'Gardens', 'Boat rides'],
    bestTimeToVisit: 'Summer',
    duration: '3-4 hours',
    accommodation: {
      hotelName: 'Chenonceau Inn',
      roomType: 'Elegant Room',
      checkInDate: '2025-06-25',
      checkOutDate: '2025-06-27',
      numberOfRooms: 1,
      occupancyDetails: '2 adults',
      specialRequests: 'River view room',
    },
    travelDetails: {
      transportationMode: 'Car Rental',
      travelDuration: '1 hour',
      cost: 20,
    },
    touristGuideDetails: {
      guideName: 'Claire Fontaine',
      experience: '7 years',
      languagesSpoken: ['English', 'French'],
      contactNumber: '+33 1 44 55 66 77',
      specialization: ['Renaissance history', 'Garden tours']
    }
  }
];
