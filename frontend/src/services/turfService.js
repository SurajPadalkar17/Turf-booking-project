import api from './api';

const turfService = {
  // Get all turfs with filters
  getAllTurfs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    return await api.get(`/turfs?${params.toString()}`);
  },

  // Get nearby turfs based on location
  getNearbyTurfs: async (latitude, longitude, radius = 5000) => {
    return await api.get(`/turfs/nearby`, {
      params: { latitude, longitude, radius }
    });
  },

  // Get single turf by ID
  getTurfById: async (turfId) => {
    return await api.get(`/turfs/${turfId}`);
  },

  // Get available time slots for a turf
  getAvailableSlots: async (turfId, date) => {
    return await api.get(`/turfs/${turfId}/available-slots`, {
      params: { date }
    });
  },

  // Add review to turf
  addReview: async (turfId, reviewData) => {
    return await api.post(`/turfs/${turfId}/reviews`, reviewData);
  },

  // Create new turf (Admin only)
  createTurf: async (turfData) => {
    return await api.post('/turfs', turfData);
  },

  // Update turf (Admin only)
  updateTurf: async (turfId, turfData) => {
    return await api.put(`/turfs/${turfId}`, turfData);
  },

  // Delete turf (Admin only)
  deleteTurf: async (turfId) => {
    return await api.delete(`/turfs/${turfId}`);
  },

  // Search turfs
  searchTurfs: async (searchTerm, filters = {}) => {
    return await api.get('/turfs', {
      params: {
        search: searchTerm,
        ...filters
      }
    });
  }
};

export default turfService;
