import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Calendar, Clock, Users, CreditCard, CheckCircle } from 'lucide-react'

const BookingModal = ({ isOpen, onClose, item, type }) => {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    seats: 1,
    partySize: 2,
    specialRequests: '',
    paymentMethod: 'card'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingReference, setBookingReference] = useState('')

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleBooking = async () => {
    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate booking reference
    const reference = `SV${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    setBookingReference(reference)
    setBookingConfirmed(true)
    setIsProcessing(false)
  }

  const resetModal = () => {
    setStep(1)
    setBookingConfirmed(false)
    setBookingReference('')
    setBookingData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      seats: 1,
      partySize: 2,
      specialRequests: '',
      paymentMethod: 'card'
    })
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!item) return null

  const getTitle = () => {
    switch (type) {
      case 'movie': return `Book Tickets - ${item.title}`
      case 'event': return `Book Event - ${item.title}`
      case 'restaurant': return `Reserve Table - ${item.name}`
      default: return 'Book Now'
    }
  }

  const getPrice = () => {
    switch (type) {
      case 'movie': return item.price * bookingData.seats
      case 'event': return item.price * bookingData.seats
      case 'restaurant': return 0 // No booking fee for restaurants
      default: return 0
    }
  }

  if (bookingConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle size={24} />
              Booking Confirmed!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">Booking Reference</p>
              <p className="text-2xl font-bold text-red-500">{bookingReference}</p>
            </div>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed. You will receive a confirmation email shortly.
            </p>
            <Button onClick={handleClose} className="w-full bg-red-500 hover:bg-red-600">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Complete your booking in {type === 'restaurant' ? '2' : '3'} simple steps
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, ...(type !== 'restaurant' ? [3] : [])].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < (type === 'restaurant' ? 2 : 3) && (
                  <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-red-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={bookingData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={bookingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {type === 'restaurant' ? 'Reservation Details' : 'Booking Details'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="quantity">
                {type === 'restaurant' ? 'Party Size' : type === 'movie' ? 'Number of Seats' : 'Number of Tickets'}
              </Label>
              <Select value={bookingData.seats.toString()} onValueChange={(value) => handleInputChange('seats', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {type === 'restaurant' && (
              <div>
                <Label htmlFor="requests">Special Requests (Optional)</Label>
                <Textarea
                  id="requests"
                  value={bookingData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requests or dietary requirements..."
                />
              </div>
            )}
          </div>
        )}

        {step === 3 && type !== 'restaurant' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal:</span>
                <span>₹{getPrice()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Convenience Fee:</span>
                <span>₹{Math.round(getPrice() * 0.05)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span>₹{getPrice() + Math.round(getPrice() * 0.05)}</span>
              </div>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={bookingData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {bookingData.paymentMethod === 'card' && (
              <div className="space-y-3">
                <Input placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" />
                </div>
                <Input placeholder="Cardholder Name" />
              </div>
            )}
            {bookingData.paymentMethod === 'upi' && (
              <Input placeholder="UPI ID (e.g., user@paytm)" />
            )}
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="ml-auto">
            {step < (type === 'restaurant' ? 2 : 3) ? (
              <Button 
                onClick={handleNext}
                disabled={!bookingData.name || !bookingData.email || !bookingData.phone}
                className="bg-red-500 hover:bg-red-600"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleBooking}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600"
              >
                {isProcessing ? 'Processing...' : type === 'restaurant' ? 'Confirm Reservation' : 'Complete Payment'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingModal

