import api from './api';

const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },

  // Get user's bookings
  getMyBookings: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    return await api.get(`/bookings/my-bookings?${params.toString()}`);
  },

  // Get single booking by ID
  getBookingById: async (bookingId) => {
    return await api.get(`/bookings/${bookingId}`);
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason) => {
    return await api.put(`/bookings/${bookingId}/cancel`, { reason });
  },

  // Get all bookings (Admin only)
  getAllBookings: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    return await api.get(`/bookings/admin/all?${params.toString()}`);
  },

  // Update booking status (Admin only)
  updateBookingStatus: async (bookingId, status, notes) => {
    return await api.put(`/bookings/${bookingId}/status`, { status, notes });
  }
};

export default bookingService;
