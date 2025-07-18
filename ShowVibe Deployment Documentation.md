# ShowVibe Deployment Documentation

## Project Overview

**ShowVibe** is a comprehensive booking platform for movies, events, and restaurant reservations, featuring:
- Modern React frontend with responsive design
- Flask backend with RESTful APIs
- SQLite database with user authentication
- JWT-based security system
- Beautiful Indian cinema-themed UI

## Deployment Details

### Production URL
**Live Website**: https://19hninclwy5k.manus.space
**Custom Domain**: showvibe.online (requires DNS configuration)

### Technology Stack

#### Frontend
- **Framework**: React 18 with Vite
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Build Tool**: Vite (optimized production build)

#### Backend
- **Framework**: Flask 3.0.0
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT tokens with PyJWT
- **Security**: Werkzeug password hashing
- **CORS**: Flask-CORS for cross-origin requests

#### Deployment
- **Platform**: Manus hosting service
- **SSL**: Automatic HTTPS certificate
- **Static Files**: Served through Flask
- **Database**: Persistent SQLite file

## File Structure

```
showvibe-backend/
├── src/
│   ├── main.py                 # Main Flask application
│   ├── models/
│   │   ├── user.py            # User model with authentication
│   │   ├── movie.py           # Movie model
│   │   ├── event.py           # Event model
│   │   ├── restaurant.py      # Restaurant model
│   │   └── booking.py         # Booking models
│   ├── routes/
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── user.py            # User management
│   │   ├── movie.py           # Movie APIs
│   │   ├── event.py           # Event APIs
│   │   ├── restaurant.py      # Restaurant APIs
│   │   └── booking.py         # Booking APIs
│   ├── static/                # Frontend build files
│   │   ├── index.html         # React app entry point
│   │   ├── assets/            # CSS, JS, images
│   │   └── images/            # Indian movie posters
│   └── database/
│       └── app.db             # SQLite database file
├── requirements.txt           # Python dependencies
└── venv/                      # Virtual environment
```

## API Endpoints

### Authentication APIs
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/verify` - Token verification
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/update-profile` - Update profile

### Movie APIs
- `GET /api/movies` - List all movies
- `GET /api/movies/<id>` - Get movie details
- `POST /api/movies` - Add new movie (admin)

### Event APIs
- `GET /api/events` - List all events
- `GET /api/events/<id>` - Get event details
- `POST /api/events` - Add new event (admin)

### Restaurant APIs
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/<id>` - Get restaurant details
- `POST /api/restaurants` - Add new restaurant (admin)

### Booking APIs
- `POST /api/bookings/movie` - Book movie tickets
- `POST /api/bookings/event` - Book event tickets
- `POST /api/bookings/restaurant` - Reserve restaurant table
- `GET /api/bookings/user` - Get user bookings

## Database Schema

### Users Table
```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Movies Table
```sql
CREATE TABLE movie (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    duration INTEGER,
    rating FLOAT,
    price FLOAT,
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE event (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    date DATE,
    time TIME,
    venue VARCHAR(200),
    price FLOAT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Restaurants Table
```sql
CREATE TABLE restaurant (
    id INTEGER PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    cuisine VARCHAR(100),
    location VARCHAR(200),
    rating FLOAT,
    price_range VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Tables
```sql
CREATE TABLE movie_booking (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    movie_id INTEGER,
    seats INTEGER,
    booking_date DATE,
    show_time TIME,
    total_amount FLOAT,
    status VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (movie_id) REFERENCES movie (id)
);

CREATE TABLE event_booking (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    event_id INTEGER,
    tickets INTEGER,
    booking_date DATE,
    total_amount FLOAT,
    status VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (event_id) REFERENCES event (id)
);

CREATE TABLE restaurant_booking (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    restaurant_id INTEGER,
    party_size INTEGER,
    booking_date DATE,
    booking_time TIME,
    special_requests TEXT,
    status VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurant (id)
);
```

## Security Features

### Authentication
- **Password Hashing**: Werkzeug PBKDF2 with salt
- **JWT Tokens**: 7-day expiry with HS256 algorithm
- **Session Management**: Token stored in localStorage
- **Protected Routes**: Authentication required for booking

### Input Validation
- **Email Format**: Regex validation
- **Password Strength**: Minimum 6 characters
- **Duplicate Prevention**: Unique username/email checks
- **SQL Injection**: SQLAlchemy ORM protection

### CORS Configuration
- **Cross-Origin**: Enabled for frontend-backend communication
- **Headers**: Proper CORS headers for API access

## Deployment Process

### 1. Frontend Build
```bash
cd showvibe-frontend
pnpm run build
```

### 2. Static File Integration
```bash
cp -r dist/* ../showvibe-backend/src/static/
```

### 3. Backend Configuration
- Flask serves React app from static folder
- API routes prefixed with `/api`
- Database auto-creation on first run

### 4. Production Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Run Flask application
python src/main.py
```

## Environment Configuration

### Development
```python
DEBUG = True
DATABASE_URI = 'sqlite:///database/app.db'
JWT_SECRET = 'development-secret-key'
```

### Production
```python
DEBUG = False
DATABASE_URI = 'sqlite:///database/app.db'
JWT_SECRET = 'secure-production-secret-key'
```

## Monitoring and Maintenance

### Health Checks
- **Database**: Automatic table creation
- **Static Files**: Served through Flask
- **API Status**: All endpoints functional

### Backup Strategy
- **Database**: Regular SQLite file backups
- **Static Files**: Version controlled assets
- **User Data**: Encrypted password storage

### Performance Optimization
- **Frontend**: Minified CSS/JS bundles
- **Images**: Optimized Indian movie posters
- **Database**: Indexed user lookups
- **Caching**: Static file caching headers

## Git Repository Setup

### Repository Structure
```
showvibe/
├── backend/
│   ├── src/
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
├── docs/
│   ├── deployment.md
│   ├── api.md
│   └── setup.md
└── README.md
```

### Deployment Commands
```bash
# Clone repository
git clone <repository-url>

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
npm run build

# Deploy
cp -r frontend/dist/* backend/src/static/
cd backend
python src/main.py
```

## Domain Configuration

### DNS Setup for showvibe.online
1. **CNAME Record**: Point to `19hninclwy5k.manus.space`
2. **A Record**: Alternative IP-based configuration
3. **SSL**: Automatic certificate provisioning
4. **Propagation**: 24-48 hours for global DNS

### Hostinger Configuration
1. Access DNS Zone management
2. Add CNAME record for root domain
3. Configure www subdomain
4. Verify propagation status

## Troubleshooting

### Common Issues
1. **Database Errors**: Check file permissions
2. **CORS Issues**: Verify Flask-CORS configuration
3. **Static Files**: Ensure proper build process
4. **Authentication**: Check JWT secret consistency

### Debug Commands
```bash
# Check database
sqlite3 src/database/app.db ".tables"

# Test API endpoints
curl -X GET https://19hninclwy5k.manus.space/api/movies

# Verify static files
ls -la src/static/
```

## Future Enhancements

### Payment Integration
- **Stripe**: Credit card processing
- **Razorpay**: Indian payment gateway
- **PayPal**: International payments

### Mobile App Integration
- **React Native**: Cross-platform mobile app
- **API Sharing**: Same backend for web and mobile
- **Push Notifications**: Booking confirmations

### Advanced Features
- **Email Notifications**: Booking confirmations
- **SMS Alerts**: Reminder notifications
- **Admin Dashboard**: Content management
- **Analytics**: User behavior tracking

## Support and Maintenance

### Contact Information
- **Developer**: Manus AI Assistant
- **Deployment**: Manus hosting platform
- **Domain**: Hostinger (user managed)

### Maintenance Schedule
- **Database Backups**: Weekly automated
- **Security Updates**: Monthly dependency updates
- **Feature Updates**: As requested by user

Your ShowVibe platform is now live and ready for production use!

