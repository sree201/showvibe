import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar, MapPin, Clock, Star, Users, Film, Music, Utensils, Search, Menu, X, LogOut, User } from 'lucide-react'
import AuthModal from './components/AuthModal.jsx'
import BookingModal from './components/BookingModal.jsx'
import './App.css'

// Import movie images
import bollywoodHero from './assets/bollywood-hero-poster.png'
import indianRomance from './assets/indian-romance-movie.png'
import indianAction from './assets/indian-action-movie.png'
import indianFamily from './assets/indian-family-drama.png'
import indianComedy from './assets/indian-comedy-movie.png'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [bookingType, setBookingType] = useState('')
  const [user, setUser] = useState(null)

  // Check for existing user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }, [])

  const handleAuthSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  const handleBookNow = (item, type) => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    
    setSelectedItem(item)
    setBookingType(type)
    setIsBookingModalOpen(true)
  }

  // Sample data
  const movies = [
    {
      id: 1,
      title: "Baahubali: The Conclusion",
      genre: "Action/Drama",
      duration: 167,
      rating: "U/A",
      price: 250,
      poster: bollywoodHero,
      description: "An epic tale of courage, love, and betrayal in ancient India."
    },
    {
      id: 2,
      title: "Dilwale Dulhania Le Jayenge",
      genre: "Romance",
      duration: 189,
      rating: "U",
      price: 200,
      poster: indianRomance,
      description: "A timeless love story that transcends borders and cultures."
    },
    {
      id: 3,
      title: "War",
      genre: "Action/Thriller",
      duration: 156,
      rating: "U/A",
      price: 300,
      poster: indianAction,
      description: "High-octane action thriller with stunning visuals."
    },
    {
      id: 4,
      title: "Kapoor & Sons",
      genre: "Family/Drama",
      duration: 132,
      rating: "U/A",
      price: 220,
      poster: indianFamily,
      description: "A heartwarming family drama about love, relationships, and forgiveness."
    },
    {
      id: 5,
      title: "3 Idiots",
      genre: "Comedy/Drama",
      duration: 170,
      rating: "U",
      price: 180,
      poster: indianComedy,
      description: "A comedy-drama about friendship, dreams, and the education system."
    }
  ]

  const events = [
    {
      id: 1,
      title: "Sunburn Festival 2025",
      category: "Music",
      date: "2025-01-15",
      time: "18:00",
      venue: "Vagator Beach, Goa",
      price: 2500,
      image: indianAction,
      description: "India's biggest electronic dance music festival."
    },
    {
      id: 2,
      title: "Stand-up Comedy Night",
      category: "Comedy",
      date: "2025-01-20",
      time: "20:00",
      venue: "Phoenix MarketCity, Mumbai",
      price: 800,
      image: indianComedy,
      description: "An evening of laughter with top comedians."
    },
    {
      id: 3,
      title: "Classical Music Concert",
      category: "Music",
      date: "2025-01-25",
      time: "19:30",
      venue: "NCPA, Mumbai",
      price: 1200,
      image: indianFamily,
      description: "Traditional Indian classical music performance."
    }
  ]

  const restaurants = [
    {
      id: 1,
      name: "Trishna",
      cuisine: "Seafood",
      location: "Fort, Mumbai",
      priceRange: "$$$$",
      rating: 4.8,
      image: indianFamily,
      description: "Contemporary Indian seafood restaurant with innovative dishes."
    },
    {
      id: 2,
      name: "Indian Accent",
      cuisine: "Modern Indian",
      location: "Lodhi Road, Delhi",
      priceRange: "$$$",
      rating: 4.7,
      image: bollywoodHero,
      description: "Inventive Indian cuisine in an elegant setting."
    },
    {
      id: 3,
      name: "Karavalli",
      cuisine: "South Indian",
      location: "UB City Mall, Bangalore",
      priceRange: "$$$",
      rating: 4.6,
      image: indianRomance,
      description: "Authentic coastal and South Indian cuisine."
    }
  ]

  const Header = () => (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-red-500">ShowVibe</h1>
            <span className="ml-2 text-sm text-gray-500">.online</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#movies" className="text-gray-700 hover:text-red-500 transition-colors">Movies</a>
            <a href="#events" className="text-gray-700 hover:text-red-500 transition-colors">Events</a>
            <a href="#restaurants" className="text-gray-700 hover:text-red-500 transition-colors">Restaurants</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-600" />
                  <span className="text-gray-700">Hi, {user.username}</span>
                </div>
                <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>Sign In</Button>
                <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsAuthModalOpen(true)}>Sign Up</Button>
              </>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#movies" className="text-gray-700 hover:text-red-500">Movies</a>
              <a href="#events" className="text-gray-700 hover:text-red-500">Events</a>
              <a href="#restaurants" className="text-gray-700 hover:text-red-500">Restaurants</a>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 py-2">
                      <User size={20} className="text-gray-600" />
                      <span className="text-gray-700">Hi, {user.username}</span>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>Sign In</Button>
                    <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsAuthModalOpen(true)}>Sign Up</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )

  const Hero = () => (
    <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Book Your Perfect Experience
        </h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Movies, Events, and Restaurants - All in One Place
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="Search movies, events, restaurants..."
                className="pl-10 h-12 text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 h-12 px-8">
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  )

  const MovieCard = ({ movie }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{movie.genre}</Badge>
          <Badge variant="outline">{movie.rating}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Clock size={16} />
            {movie.duration} min
          </span>
          <span className="font-semibold text-red-500">₹{movie.price}</span>
        </div>
        <Button 
          className="w-full bg-red-500 hover:bg-red-600"
          onClick={() => handleBookNow(movie, 'movie')}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  )

  const EventCard = ({ event }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        <Badge className="mb-3">{event.category}</Badge>
        <div className="space-y-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {event.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {event.venue}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-red-500">₹{event.price}</span>
          <Button 
            className="bg-red-500 hover:bg-red-600"
            onClick={() => handleBookNow(event, 'event')}
          >
            Book Tickets
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const RestaurantCard = ({ restaurant }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{restaurant.cuisine}</Badge>
          <Badge variant="outline">{restaurant.priceRange}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {restaurant.location}
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            {restaurant.rating}
          </div>
        </div>
        <Button 
          className="w-full bg-red-500 hover:bg-red-600"
          onClick={() => handleBookNow(restaurant, 'restaurant')}
        >
          Reserve Table
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film size={20} />
              Movies
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Music size={20} />
              Events
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <Utensils size={20} />
              Restaurants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" id="movies">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Now Showing</h2>
              <p className="text-gray-600">Book tickets for the latest movies</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" id="events">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-gray-600">Discover amazing events happening near you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="restaurants" id="restaurants">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Top Restaurants</h2>
              <p className="text-gray-600">Reserve tables at the finest dining establishments</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShowVibe</h3>
              <p className="text-gray-400">Your one-stop destination for booking movies, events, and restaurant tables.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#movies" className="hover:text-white">Movies</a></li>
                <li><a href="#events" className="hover:text-white">Events</a></li>
                <li><a href="#restaurants" className="hover:text-white">Restaurants</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Download App</h4>
              <p className="text-gray-400 mb-4">Get the ShowVibe app on Google Play Store</p>
              <Button className="bg-red-500 hover:bg-red-600">
                Download App
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ShowVibe.online. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        item={selectedItem}
        type={bookingType}
      />
    </div>
  )
}

export default App

