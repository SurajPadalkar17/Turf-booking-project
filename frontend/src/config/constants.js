// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// App Configuration
export const APP_NAME = 'TurfBook';
export const APP_DESCRIPTION = 'Book Your Game, Anytime, Anywhere';

// Map Configuration
export const DEFAULT_MAP_CENTER = [21.1458, 79.0882]; // Nagpur coordinates
export const DEFAULT_MAP_ZOOM = 13;
export const SEARCH_RADIUS = 5000; // 5km in meters

// Booking Configuration
export const SLOT_DURATIONS = [30, 60, 90, 120]; // in minutes
export const MAX_ADVANCE_BOOKING_DAYS = 30;

// Payment Configuration
export const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

// Sports Categories
export const SPORTS_CATEGORIES = [
  'Football',
  'Cricket',
  'Badminton',
  'Basketball',
  'Tennis',
  'Hockey',
  'Volleyball'
];

// Turf Types
export const TURF_TYPES = [
  'Natural Grass',
  'Artificial Turf',
  'Hybrid',
  'Indoor',
  'Outdoor'
];

// Amenities
export const AMENITIES = [
  'Parking',
  'Changing Room',
  'Washroom',
  'First Aid',
  'Drinking Water',
  'Lighting',
  'Seating Area',
  'Equipment Rental',
  'Cafe/Canteen',
  'WiFi',
  'CCTV',
  'Security'
];

// Time Slots
export const generateTimeSlots = (startTime, endTime, duration) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentTime = startHour * 60 + startMin;
  const endTimeMinutes = endHour * 60 + endMin;

  while (currentTime < endTimeMinutes) {
    const slotStart = currentTime;
    const slotEnd = currentTime + duration;

    if (slotEnd <= endTimeMinutes) {
      const startHours = Math.floor(slotStart / 60);
      const startMinutes = slotStart % 60;
      const endHours = Math.floor(slotEnd / 60);
      const endMinutes = slotEnd % 60;

      slots.push({
        startTime: `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`,
        endTime: `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`,
        duration
      });
    }

    currentTime += duration;
  }

  return slots;
};

// Date Formatting
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Validation
export const isValidEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'turfbook_token',
  USER: 'turfbook_user',
  LOCATION: 'turfbook_location'
};
