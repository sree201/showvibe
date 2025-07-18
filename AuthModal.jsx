import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Eye, EyeOff, User, Mail, Lock, Phone, CheckCircle, AlertCircle } from 'lucide-react'

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  })
  
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })

  const handleSignInChange = (field, value) => {
    setSignInData(prev => ({ ...prev, [field]: value }))
    setMessage({ type: '', text: '' })
  }

  const handleSignUpChange = (field, value) => {
    setSignUpData(prev => ({ ...prev, [field]: value }))
    setMessage({ type: '', text: '' })
  }

  const validateSignUp = () => {
    if (!signUpData.username || !signUpData.email || !signUpData.password || !signUpData.phone) {
      setMessage({ type: 'error', text: 'All fields are required' })
      return false
    }
    
    if (signUpData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return false
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signUpData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      return false
    }
    
    return true
  }

  const handleSignUp = async () => {
    if (!validateSignUp()) return
    
    setIsLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signUpData.username,
          email: signUpData.email,
          password: signUpData.password,
          phone: signUpData.phone
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Account created successfully! Please sign in.' })
        // Reset form
        setSignUpData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create account' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!signInData.email || !signInData.password) {
      setMessage({ type: 'error', text: 'Email and password are required' })
      return
    }
    
    setIsLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signInData.email,
          password: signInData.password
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        
        setMessage({ type: 'success', text: 'Signed in successfully!' })
        
        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(data.user)
        }
        
        // Close modal after short delay
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to sign in' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSignInData({ email: '', password: '' })
    setSignUpData({ username: '', email: '', password: '', confirmPassword: '', phone: '' })
    setMessage({ type: '', text: '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to ShowVibe</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to start booking
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={signInData.email}
                    onChange={(e) => handleSignInChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={signInData.password}
                    onChange={(e) => handleSignInChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {message.text && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              <Button 
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="signup-username"
                    placeholder="Choose a username"
                    className="pl-10"
                    value={signUpData.username}
                    onChange={(e) => handleSignUpChange('username', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={signUpData.email}
                    onChange={(e) => handleSignUpChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="signup-phone"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={signUpData.phone}
                    onChange={(e) => handleSignUpChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    value={signUpData.password}
                    onChange={(e) => handleSignUpChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={signUpData.confirmPassword}
                    onChange={(e) => handleSignUpChange('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {message.text && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              <Button 
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal

