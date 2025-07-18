from src.models.user import db
from datetime import datetime

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True)  # Concert, Workshop, Sports, etc.
    venue_name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(500), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=True)
    price = db.Column(db.Float, nullable=False, default=25.00)
    available_tickets = db.Column(db.Integer, nullable=False, default=500)
    total_tickets = db.Column(db.Integer, nullable=False, default=500)
    image_url = db.Column(db.String(500), nullable=True)
    organizer_name = db.Column(db.String(200), nullable=True)
    organizer_contact = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with bookings
    event_bookings = db.relationship('EventBooking', backref='event', lazy=True)

    def __repr__(self):
        return f'<Event {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'venue_name': self.venue_name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'event_date': self.event_date.isoformat(),
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'price': self.price,
            'available_tickets': self.available_tickets,
            'total_tickets': self.total_tickets,
            'image_url': self.image_url,
            'organizer_name': self.organizer_name,
            'organizer_contact': self.organizer_contact,
            'created_at': self.created_at.isoformat()
        }

