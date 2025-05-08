export const mockRestaurants = [
  {
    id: '1',
    name: 'The Italian Place',
    description: 'Authentic Italian cuisine with a modern twist.',
    cuisineType: ['Italian'],
    priceRange: '$$$',
    location: 'New York',
    rating: 4.5,
    openingHours: {
      opening: '11:00 AM',
      closing: '10:00 PM'
    },
    image: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Sakura Japanese',
    description: 'Traditional Japanese dishes and sushi.',
    cuisineType: ['Japanese'],
    priceRange: '$$',
    location: 'New York',
    rating: 4.3,
    openingHours: {
      opening: '12:00 PM',
      closing: '11:00 PM'
    },
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'The Steakhouse',
    description: 'Premium steaks and fine dining.',
    cuisineType: ['Steakhouse'],
    priceRange: '$$$$',
    location: 'New York',
    rating: 4.7,
    openingHours: {
      opening: '4:00 PM',
      closing: '11:00 PM'
    },
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=800&auto=format&fit=crop'
  },
];

export const mockMenuItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella and basil.',
    price: 12.99,
    restaurantId: '1',
  },
  {
    id: '2',
    name: 'Sushi Platter',
    description: 'Assorted sushi rolls and sashimi.',
    price: 24.99,
    restaurantId: '2',
  },
  {
    id: '3',
    name: 'Ribeye Steak',
    description: 'Juicy ribeye steak cooked to perfection.',
    price: 29.99,
    restaurantId: '3',
  },
];