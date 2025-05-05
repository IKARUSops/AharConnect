
// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  cuisineType: string[];
  rating: number;
  priceRange: string;
  openingHours: {
    opening: string;
    closing: string;
  };
  image: string;
  phoneNumber: string;
  email: string;
  capacity: number;
  availableForEvents: boolean;
}

// Order Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  preparationTime: number; // in minutes
  restaurantId: string;
  inventoryItems?: string[]; // IDs of linked inventory items
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'canceled';
  totalAmount: number;
  createdAt: string;
  estimatedDeliveryTime?: string;
  tableNumber?: number;
  isDelivery: boolean;
  deliveryAddress?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

// Reservation Types
export interface Reservation {
  id: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'canceled';
  specialRequests?: string;
  tableNumber?: number;
}

// Event Types
export interface EventPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  maxCapacity: number;
  amenities: string[];
  restaurantId: string;
}

export interface EventBooking {
  id: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventPackageId: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'canceled';
  totalAmount: number;
  specialRequests?: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  senderType: "customer" | "restaurant";
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold: number; // alert threshold
  cost: number;
  restaurantId: string;
  supplier?: string;
  lastRestocked?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'customer' | 'restaurant_owner' | 'restaurant_staff' | 'admin';
  profileImage?: string;
  restaurantId?: string; // for restaurant owners and staff
}

// Analytics Types
export interface OrderAnalytics {
  topSellingItems: {
    itemName: string;
    quantity: number;
  }[];
  ordersByHour: {
    hour: number;
    count: number;
  }[];
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
