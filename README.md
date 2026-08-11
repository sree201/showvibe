# ShowVibe

A full-stack booking platform that unifies movies, events, and restaurant
reservations into a single, streamlined experience.

## Features

- 🎬 Movie ticket booking
- 🎟️ Event booking
- 🍽️ Restaurant reservations
- 🔐 JWT-based authentication
- 🎨 Modern, responsive UI

## Tech stack

**Frontend:** React (JSX components for auth, booking, and browsing flows)

**Backend:** Flask, Flask-SQLAlchemy, Flask-CORS, PyJWT

## Project structure

- `main.py` — application entry point
- `auth.py`, `AuthModal.jsx` — authentication (backend + UI)
- `booking.py`, `BookingModal.jsx` — booking flow (backend + UI)
- `event.py`, `movie.py`, `restaurant.py` — domain models/routes for each booking category
- `user.py` — user management

## Setup

```bash
pip install -r requirements.txt
./setup_showvibe.sh
```

See `ShowVibe Deployment Documentation.md` and `Domain Configuration Guide for
showvibe.online.md` for deployment details, and `ShowVibe Design Concept.md`
for the design system.
