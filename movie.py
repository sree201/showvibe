from src.models.user import db
from datetime import datetime

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    genre = db.Column(db.String(100), nullable=True)
    duration = db.Column(db.Integer, nullable=True)  # in minutes
    rating = db.Column(db.String(10), nullable=True)  # PG, PG-13, R, etc.
    poster_url = db.Column(db.String(500), nullable=True)
    trailer_url = db.Column(db.String(500), nullable=True)
    release_date = db.Column(db.Date, nullable=True)
    price = db.Column(db.Float, nullable=False, default=12.99)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with showtimes
    showtimes = db.relationship('Showtime', backref='movie', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Movie {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'genre': self.genre,
            'duration': self.duration,
            'rating': self.rating,
            'poster_url': self.poster_url,
            'trailer_url': self.trailer_url,
            'release_date': self.release_date.isoformat() if self.release_date else None,
            'price': self.price,
            'created_at': self.created_at.isoformat()
        }

class Theater(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(500), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    
    # Relationship with showtimes
    showtimes = db.relationship('Showtime', backref='theater', lazy=True)

    def __repr__(self):
        return f'<Theater {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'phone': self.phone
        }

class Showtime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    theater_id = db.Column(db.Integer, db.ForeignKey('theater.id'), nullable=False)
    show_date = db.Column(db.Date, nullable=False)
    show_time = db.Column(db.Time, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False, default=100)
    total_seats = db.Column(db.Integer, nullable=False, default=100)
    
    # Relationship with bookings
    movie_bookings = db.relationship('MovieBooking', backref='showtime', lazy=True)

    def __repr__(self):
        return f'<Showtime {self.movie.title} at {self.theater.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'movie_id': self.movie_id,
            'theater_id': self.theater_id,
            'show_date': self.show_date.isoformat(),
            'show_time': self.show_time.isoformat(),
            'available_seats': self.available_seats,
            'total_seats': self.total_seats,
            'movie': self.movie.to_dict() if self.movie else None,
            'theater': self.theater.to_dict() if self.theater else None
        }

