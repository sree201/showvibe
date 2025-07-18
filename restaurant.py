from src.models.user import db
from datetime import datetime

class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    cuisine_type = db.Column(db.String(100), nullable=True)  # Italian, Chinese, American, etc.
    address = db.Column(db.String(500), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    website = db.Column(db.String(200), nullable=True)
    price_range = db.Column(db.String(10), nullable=True)  # $, $$, $$$, $$$$
    rating = db.Column(db.Float, nullable=True, default=0.0)
    image_url = db.Column(db.String(500), nullable=True)
    opening_hours = db.Column(db.Text, nullable=True)  # JSON string with hours
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with tables and bookings
    tables = db.relationship('RestaurantTable', backref='restaurant', lazy=True, cascade='all, delete-orphan')
    restaurant_bookings = db.relationship('RestaurantBooking', backref='restaurant', lazy=True)

    def __repr__(self):
        return f'<Restaurant {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'cuisine_type': self.cuisine_type,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'phone': self.phone,
            'email': self.email,
            'website': self.website,
            'price_range': self.price_range,
            'rating': self.rating,
            'image_url': self.image_url,
            'opening_hours': self.opening_hours,
            'created_at': self.created_at.isoformat()
        }

class RestaurantTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    table_number = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    table_type = db.Column(db.String(50), nullable=True)  # Indoor, Outdoor, Private, etc.
    is_available = db.Column(db.Boolean, default=True)
    
    # Relationship with bookings
    table_bookings = db.relationship('RestaurantBooking', backref='table', lazy=True)

    def __repr__(self):
        return f'<Table {self.table_number} at {self.restaurant.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'table_number': self.table_number,
            'capacity': self.capacity,
            'table_type': self.table_type,
            'is_available': self.is_available
        }

