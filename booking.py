from src.models.user import db
from datetime import datetime

class MovieBooking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    showtime_id = db.Column(db.Integer, db.ForeignKey('showtime.id'), nullable=False)
    seats_booked = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    booking_status = db.Column(db.String(20), nullable=False, default='pending')  # pending, confirmed, cancelled
    payment_status = db.Column(db.String(20), nullable=False, default='pending')  # pending, completed, failed
    payment_id = db.Column(db.String(100), nullable=True)
    booking_reference = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with user
    user = db.relationship('User', backref='movie_bookings')

    def __repr__(self):
        return f'<MovieBooking {self.booking_reference}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'showtime_id': self.showtime_id,
            'seats_booked': self.seats_booked,
            'total_amount': self.total_amount,
            'booking_status': self.booking_status,
            'payment_status': self.payment_status,
            'payment_id': self.payment_id,
            'booking_reference': self.booking_reference,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'showtime': self.showtime.to_dict() if self.showtime else None,
            'user': self.user.to_dict() if self.user else None
        }

class EventBooking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    tickets_booked = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    booking_status = db.Column(db.String(20), nullable=False, default='pending')  # pending, confirmed, cancelled
    payment_status = db.Column(db.String(20), nullable=False, default='pending')  # pending, completed, failed
    payment_id = db.Column(db.String(100), nullable=True)
    booking_reference = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with user
    user = db.relationship('User', backref='event_bookings')

    def __repr__(self):
        return f'<EventBooking {self.booking_reference}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'tickets_booked': self.tickets_booked,
            'total_amount': self.total_amount,
            'booking_status': self.booking_status,
            'payment_status': self.payment_status,
            'payment_id': self.payment_id,
            'booking_reference': self.booking_reference,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'event': self.event.to_dict() if self.event else None,
            'user': self.user.to_dict() if self.user else None
        }

class RestaurantBooking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('restaurant_table.id'), nullable=False)
    reservation_date = db.Column(db.Date, nullable=False)
    reservation_time = db.Column(db.Time, nullable=False)
    party_size = db.Column(db.Integer, nullable=False)
    special_requests = db.Column(db.Text, nullable=True)
    booking_status = db.Column(db.String(20), nullable=False, default='pending')  # pending, confirmed, cancelled
    booking_reference = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with user
    user = db.relationship('User', backref='restaurant_bookings')

    def __repr__(self):
        return f'<RestaurantBooking {self.booking_reference}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'table_id': self.table_id,
            'reservation_date': self.reservation_date.isoformat(),
            'reservation_time': self.reservation_time.isoformat(),
            'party_size': self.party_size,
            'special_requests': self.special_requests,
            'booking_status': self.booking_status,
            'booking_reference': self.booking_reference,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'restaurant': self.restaurant.to_dict() if self.restaurant else None,
            'table': self.table.to_dict() if self.table else None,
            'user': self.user.to_dict() if self.user else None
        }

