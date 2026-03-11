# Turf Booking Platform - Backend

A comprehensive backend API for turf booking platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 📍 **Location-Based Search** - Find nearby turfs using geospatial queries
- 📅 **Smart Booking System** - Real-time slot availability checking
- 💳 **Payment Integration** - Razorpay payment gateway integration
- 🔒 **Security** - Helmet, CORS, rate limiting, and input validation
- 📱 **RESTful API** - Well-structured endpoints with proper error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay
- **Security**: Helmet, bcryptjs, express-validator, express-rate-limit
- **Utilities**: dotenv, morgan, compression

## Project Structure

```
backend/
├── config/
│   └── razorpay.js           # Razorpay configuration
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── booking.controller.js # Booking management
│   ├── payment.controller.js # Payment processing
│   └── turf.controller.js    # Turf CRUD operations
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   └── validation.middleware.js # Input validation
├── models/
│   ├── Booking.js            # Booking schema
│   ├── Turf.js               # Turf schema
│   └── User.js               # User schema
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── booking.routes.js     # Booking endpoints
│   ├── payment.routes.js     # Payment endpoints
│   └── turf.routes.js        # Turf endpoints
├── utils/
│   └── helpers.js            # Utility functions
├── .env.example              # Environment variables template
├── package.json              # Dependencies
└── server.js                 # Application entry point
```

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
```

3. **Configure Environment Variables**
Edit `.env` file with your credentials:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/turf-booking
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the Server**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/password` - Update password (Protected)
- `POST /api/auth/logout` - Logout (Protected)

### Turfs
- `GET /api/turfs` - Get all turfs with filters
- `GET /api/turfs/nearby` - Find nearby turfs by location
- `GET /api/turfs/:id` - Get single turf
- `GET /api/turfs/:id/available-slots` - Get available time slots
- `POST /api/turfs` - Create turf (Admin)
- `PUT /api/turfs/:id` - Update turf (Admin)
- `DELETE /api/turfs/:id` - Delete turf (Admin)
- `POST /api/turfs/:id/reviews` - Add review (Protected)

### Bookings
- `POST /api/bookings` - Create new booking (Protected)
- `GET /api/bookings/my-bookings` - Get user's bookings (Protected)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)
- `GET /api/bookings/admin/all` - Get all bookings (Admin)
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

### Payments
- `GET /api/payments/razorpay-key` - Get Razorpay key
- `POST /api/payments/create-order` - Create payment order (Protected)
- `POST /api/payments/verify` - Verify payment (Protected)
- `POST /api/payments/failure` - Handle payment failure (Protected)
- `GET /api/payments/:bookingId` - Get payment details (Protected)
- `POST /api/payments/refund` - Process refund (Admin)

## Key Features Implementation

### 1. Location-Based Search
Uses MongoDB geospatial queries to find turfs within a specified radius:
```javascript
GET /api/turfs/nearby?latitude=21.1458&longitude=79.0882&radius=5000
```

### 2. Real-Time Slot Availability
Automatically checks booking conflicts before confirming:
```javascript
GET /api/turfs/:id/available-slots?date=2024-12-25
```

### 3. Secure Payment Flow
1. Create booking (status: pending)
2. Create Razorpay order
3. Complete payment on frontend
4. Verify payment signature
5. Confirm booking (status: confirmed)

### 4. Smart Cancellation & Refunds
- 100% refund if cancelled 24+ hours before
- 50% refund if cancelled 12-24 hours before
- No refund if cancelled less than 12 hours before

### 5. Security Features
- Password hashing with bcrypt
- JWT token authentication
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers

## Database Models

### User Schema
- Personal information (name, email, phone)
- Authentication (hashed password)
- Location data (geospatial coordinates)
- Role-based access (user/admin)

### Turf Schema
- Venue details (name, description, images)
- Location (coordinates, address)
- Pricing (weekday/weekend rates)
- Operating hours and slot duration
- Amenities and features
- Ratings and reviews

### Booking Schema
- User and turf references
- Date and time slot
- Pricing breakdown
- Payment details
- Cancellation information
- Status tracking

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Success Responses

Standard success response format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {} // Response data
}
```

## Testing

You can test the API using:
- **Postman** - Import the collection
- **cURL** - Command line testing
- **Thunder Client** - VS Code extension

## Production Deployment

1. Set `NODE_ENV=production`
2. Use proper MongoDB connection string
3. Set strong JWT_SECRET
4. Configure production Razorpay credentials
5. Enable HTTPS
6. Set up proper logging
7. Configure reverse proxy (nginx)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment | development/production |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection | mongodb://localhost:27017/db |
| JWT_SECRET | JWT signing key | strong-secret-key |
| JWT_EXPIRE | Token expiry | 7d |
| RAZORPAY_KEY_ID | Razorpay public key | rzp_test_xxx |
| RAZORPAY_KEY_SECRET | Razorpay secret key | xxx |
| FRONTEND_URL | Frontend URL | http://localhost:3000 |

## Contributing

1. Follow existing code structure
2. Write clear commit messages
3. Add comments for complex logic
4. Update documentation

## License

MIT License

## Support

For support, contact the development team.
