// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Example: Reservation types (customize as needed)
export interface Reservation {
  id: string;
  userId: string;
  date: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface CreateReservationDto {
  userId: string;
  date: string;
}

export interface UpdateReservationDto {
  date?: string;
  status?: ReservationStatus;
}
