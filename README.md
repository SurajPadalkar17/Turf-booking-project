# 🏟️ Turf Booking Platform

A comprehensive full-stack turf booking platform similar to Agoda, built with React.js, Node.js, and MongoDB.

## 🚀 Features

### User Features
- ✅ **Secure Authentication** - JWT-based login/register system
- 📍 **Location-Based Search** - Find turfs near you using geolocation
- 🔍 **Advanced Filters** - Search by sport, price, amenities, and more
- 📅 **Real-Time Availability** - See available time slots instantly
- 💳 **Razorpay Integration** - Secure online payment processing
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 📧 **Booking Confirmations** - Get instant booking confirmations
- ❌ **Easy Cancellations** - Cancel bookings with automatic refunds
- ⭐ **Reviews & Ratings** - Rate and review turfs
- 📊 **Booking History** - Track all your past and upcoming bookings

### Technical Features
- 🔐 **Secure Backend** - Express.js with helmet, rate limiting, CORS
- 🗄️ **MongoDB Database** - Efficient data storage with geospatial indexing
- 🎨 **Modern UI** - Athletic green theme with bold accents
- 📦 **Modular Architecture** - Separate folders for routes, controllers, models
- 🧪 **Production Ready** - Error handling, validation, logging
- 📱 **API First** - RESTful API design

## 📁 Project Structure

```
turf-booking-platform/
├── backend/
│   ├── config/
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   └── turf.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Turf.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   └── turf.routes.js
│   ├── utils/
│   │   └── helpers.js
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── assets/
    │   │   └── styles/
    │   │       └── globals.css
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── booking/
    │   │   ├── common/
    │   │   ├── layout/
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Footer.css
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Navbar.css
    │   │   └── turf/
    │   ├── config/
    │   │   └── constants.js
    │   ├── contexts/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── HomePage.css
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── TurfListPage.jsx
    │   │   ├── TurfDetailPage.jsx
    │   │   ├── BookingPage.jsx
    │   │   └── MyBookingsPage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── bookingService.js
    │   │   ├── paymentService.js
    │   │   └── turfService.js
    │   ├── utils/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/turf-booking
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the server**
```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file** (optional)
Create `.env` in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development/production |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/turf-booking |
| JWT_SECRET | Secret key for JWT | your-secret-key |
| JWT_EXPIRE | JWT expiration time | 7d |
| RAZORPAY_KEY_ID | Razorpay public key | rzp_test_xxx |
| RAZORPAY_KEY_SECRET | Razorpay secret key | xxx |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Update password
- `POST /api/auth/logout` - Logout user

### Turf Endpoints
- `GET /api/turfs` - Get all turfs (with filters)
- `GET /api/turfs/nearby` - Find nearby turfs
- `GET /api/turfs/:id` - Get turf details
- `GET /api/turfs/:id/available-slots` - Get available slots
- `POST /api/turfs/:id/reviews` - Add review
- `POST /api/turfs` - Create turf (Admin)
- `PUT /api/turfs/:id` - Update turf (Admin)
- `DELETE /api/turfs/:id` - Delete turf (Admin)

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payment Endpoints
- `GET /api/payments/razorpay-key` - Get Razorpay key
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/failure` - Handle payment failure
- `GET /api/payments/:bookingId` - Get payment details

## 🎨 Design System

### Colors
- **Primary (Athletic Green)**: #059669, #10b981, #34d399
- **Accent (Electric Orange)**: #f97316, #fb923c, #fdba74
- **Neutrals**: From #0f172a to #f8fafc

### Typography
- **Display Font**: Syne (headings)
- **Body Font**: Outfit (content)

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in platform dashboard
2. Update MongoDB URI to cloud instance (MongoDB Atlas)
3. Set NODE_ENV=production
4. Deploy using Git or CLI

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Set REACT_APP_API_URL to production backend URL
3. Deploy build folder

## 📱 Usage Flow

1. **User Registration/Login**
   - User creates account or logs in
   - JWT token stored in localStorage

2. **Find Turfs**
   - Browse all turfs or use location-based search
   - Filter by sport, price, amenities, date

3. **View Turf Details**
   - See images, amenities, pricing, reviews
   - Check real-time slot availability

4. **Book a Slot**
   - Select date and time slot
   - Fill customer details
   - Make payment via Razorpay

5. **Manage Bookings**
   - View upcoming and past bookings
   - Cancel bookings (with refund policy)
   - Leave reviews

## 🔐 Security Features

- Password hashing with bcrypt
- JWT authentication
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers
- SQL injection prevention (MongoDB)
- XSS protection

## 📦 Dependencies

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- razorpay - Payment gateway
- helmet - Security headers
- cors - CORS handling
- express-validator - Input validation
- dotenv - Environment variables

### Frontend
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- react-toastify - Notifications
- react-icons - Icon library
- leaflet - Maps
- date-fns - Date utilities

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB connection error**: Check if MongoDB is running
- **JWT token errors**: Verify JWT_SECRET in .env
- **Payment errors**: Confirm Razorpay credentials

### Frontend Issues
- **API connection error**: Check REACT_APP_API_URL
- **CORS errors**: Verify FRONTEND_URL in backend .env
- **Build errors**: Clear node_modules and reinstall

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For support, email support@turfbook.com or raise an issue in the repository.

## 🎯 Roadmap

- [ ] Admin dashboard
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Push notifications
- [ ] Social login (Google, Facebook)

## ⚡ Quick Start Commands

```bash
# Clone repository
git clone <repository-url>

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

Visit `http://localhost:3000` to see the application!

---

Built with ❤️ for sports enthusiasts
