import React from 'react';

const mockMenuItems = [
  { id: 'menu-1', name: 'Pizza', price: 10 },
  { id: 'menu-2', name: 'Burger', price: 8 },
];

const mockData = [
  {
    id: 'order-1',
    items: [
      {
        menuItem: mockMenuItems.find(item => item.id === 'menu-1'),
        quantity: 2,
        specialInstructions: 'Extra parmesan please',
      },
    ],
  },
];

export { mockMenuItems, mockData };
