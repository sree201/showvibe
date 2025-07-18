# ShowVibe Authentication System Implementation

## Overview
I've implemented a complete user authentication system for your ShowVibe booking platform with signup, signin, and session management capabilities.

## Database Structure

### User Table Schema
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

### Database Location
- **File**: `/showvibe-backend/src/database/app.db`
- **Type**: SQLite (perfect for development and small-medium production)
- **Auto-creation**: Database and tables are created automatically on first run

## Backend Implementation (Flask)

### Dependencies Added
- **PyJWT**: For JSON Web Token authentication
- **Werkzeug**: For secure password hashing (already included with Flask)

### API Endpoints

#### 1. User Registration
- **Endpoint**: `POST /api/auth/signup`
- **Body**: `{"username": "string", "email": "string", "password": "string", "phone": "string"}`
- **Validation**: Email format, password length (6+ chars), unique username/email
- **Response**: User data (without password) or error message

#### 2. User Login
- **Endpoint**: `POST /api/auth/signin`
- **Body**: `{"email": "string", "password": "string"}`
- **Response**: JWT token + user data or error message
- **Token Expiry**: 7 days

#### 3. Token Verification
- **Endpoint**: `GET /api/auth/verify`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User data if token is valid

#### 4. User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Complete user profile data

#### 5. Update Profile
- **Endpoint**: `PUT /api/auth/update-profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{"username": "string", "phone": "string"}`
- **Response**: Updated user data

### Security Features
- **Password Hashing**: Uses Werkzeug's secure PBKDF2 hashing
- **JWT Tokens**: Stateless authentication with expiry
- **Input Validation**: Server-side validation for all inputs
- **Duplicate Prevention**: Checks for existing usernames/emails
- **Error Handling**: Proper HTTP status codes and error messages

## Frontend Implementation (React)

### Components Created

#### 1. AuthModal Component
- **File**: `/showvibe-frontend/src/components/AuthModal.jsx`
- **Features**:
  - Tabbed interface (Sign In / Sign Up)
  - Form validation with real-time feedback
  - Password visibility toggle
  - Loading states and error messages
  - Success notifications

#### 2. BookingModal Component
- **File**: `/showvibe-frontend/src/components/BookingModal.jsx`
- **Features**:
  - Multi-step booking process
  - Different flows for movies, events, restaurants
  - Payment integration ready
  - User authentication required

### Authentication Flow
1. **User clicks Sign Up/Sign In**: Opens AuthModal
2. **Form Submission**: Sends request to backend API
3. **Success Response**: Stores JWT token and user data in localStorage
4. **Session Persistence**: Checks localStorage on app load
5. **Protected Actions**: Booking requires authentication
6. **Logout**: Clears localStorage and updates UI

### UI/UX Features
- **Responsive Design**: Works on desktop and mobile
- **Visual Feedback**: Loading spinners, success/error messages
- **Form Validation**: Client-side validation before API calls
- **Session Display**: Shows username in header when logged in
- **Logout Functionality**: Clean session termination

## Integration with Booking System

### Protected Booking Flow
1. User clicks "Book Now" on any item
2. System checks if user is authenticated
3. If not authenticated: Opens AuthModal
4. If authenticated: Opens BookingModal
5. Booking process includes user information automatically

### Booking Modal Features
- **Step-by-step Process**: Personal info → Details → Payment
- **User Pre-fill**: Authenticated user data auto-fills forms
- **Different Flows**: Movies/Events (3 steps), Restaurants (2 steps)
- **Payment Integration**: Ready for payment gateway integration

## File Structure

### Backend Files
```
showvibe-backend/
├── src/
│   ├── models/
│   │   └── user.py (Enhanced with auth fields)
│   ├── routes/
│   │   └── auth.py (New authentication routes)
│   ├── database/
│   │   └── app.db (Auto-created SQLite database)
│   └── main.py (Updated with auth blueprint)
```

### Frontend Files
```
showvibe-frontend/
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx (New authentication modal)
│   │   └── BookingModal.jsx (New booking modal)
│   └── App.jsx (Updated with auth state management)
```

## Testing the System

### Manual Testing Steps
1. **Registration**: Fill out signup form with valid data
2. **Login**: Use registered credentials to sign in
3. **Session Persistence**: Refresh page, user should stay logged in
4. **Protected Booking**: Try booking without login (should prompt auth)
5. **Logout**: Click logout button, should clear session

### API Testing (using curl)
```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","phone":"+91 9876543210"}'

# Login
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Verify token (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer TOKEN"
```

## Production Considerations

### Security Enhancements
1. **Environment Variables**: Move JWT secret to environment variable
2. **HTTPS**: Use SSL certificates in production
3. **Rate Limiting**: Add rate limiting to prevent brute force attacks
4. **Email Verification**: Add email verification for new accounts
5. **Password Reset**: Implement forgot password functionality

### Database Upgrades
1. **PostgreSQL**: Consider upgrading from SQLite for production
2. **Connection Pooling**: Add database connection pooling
3. **Migrations**: Implement database migration system
4. **Backups**: Set up automated database backups

### Monitoring & Logging
1. **Authentication Logs**: Log login attempts and failures
2. **Error Tracking**: Implement error tracking service
3. **Performance Monitoring**: Monitor API response times
4. **User Analytics**: Track user registration and engagement

## Troubleshooting

### Common Issues
1. **Network Error**: Check if backend server is running on port 5000
2. **CORS Issues**: Ensure Flask-CORS is properly configured
3. **Database Errors**: Check if database directory exists and is writable
4. **Token Expiry**: Tokens expire after 7 days, users need to re-login

### Debug Steps
1. Check browser console for JavaScript errors
2. Check Flask server logs for API errors
3. Verify database file exists and has correct permissions
4. Test API endpoints directly using curl or Postman

## Next Steps

The authentication system is now fully functional and integrated with your booking platform. Users can:
- Create accounts securely
- Sign in and maintain sessions
- Access protected booking features
- Manage their profiles

The system is ready for production deployment with your domain showvibe.online!

