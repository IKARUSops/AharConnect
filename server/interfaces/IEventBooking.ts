
export interface IEventBooking {
  id?: string;
  eventSpaceId: string;
  userId: string;
  restaurantId: string;
  startDateTime: Date;
  endDateTime: Date;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  specialRequests?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventBookingRepository {
  create(booking: IEventBooking): Promise<IEventBooking>;
  findById(id: string): Promise<IEventBooking | null>;
  findByUserId(userId: string): Promise<IEventBooking[]>;
  findByEventSpaceId(eventSpaceId: string): Promise<IEventBooking[]>;
  update(id: string, booking: Partial<IEventBooking>): Promise<IEventBooking | null>;
  delete(id: string): Promise<boolean>;
  findOverlappingBookings(eventSpaceId: string, startDateTime: Date, endDateTime: Date): Promise<IEventBooking[]>;
}