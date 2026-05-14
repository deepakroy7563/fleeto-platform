import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, register, clearError } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, Phone, Briefcase } from 'lucide-react'

const Auth = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'customer',
    agencyName: '',
    address: '',
    lat: '',
    lng: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin')
      else if (user?.role === 'dealer') navigate('/dashboard')
      else navigate('/')
    }
    return () => dispatch(clearError())
  }, [isAuthenticated, user, navigate, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === 'login') {
      dispatch(login({ email: formData.email, password: formData.password }))
    } else {
      dispatch(register(formData))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electricGreen opacity-10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-panel p-10 rounded-[3rem] border border-white border-opacity-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Zap className="h-8 w-8 text-electricGreen" />
            <span className="text-2xl font-black tracking-tighter">FLEETO</span>
          </Link>
          <h2 className="text-3xl font-black uppercase">{mode === 'login' ? 'Welcome Back' : 'Join Fleeto'}</h2>
          <p className="text-gray-400 mt-2">{mode === 'login' ? 'Login to your account' : 'Create your account today'}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <select
                  className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="dealer">Dealer</option>
                </select>
              </div>
              {formData.role === 'dealer' && (
                <>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      required
                      type="text"
                      placeholder="Agency Name"
                      className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
                      value={formData.agencyName}
                      onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500">📍</div>
                    <input
                      required
                      type="text"
                      placeholder="Full Agency Address"
                      className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          setFormData({ ...formData, lat: pos.coords.latitude, lng: pos.coords.longitude })
                          alert("Location coordinates captured!")
                        })
                      }
                    }}
                    className="w-full bg-white/5 text-xs font-black uppercase tracking-widest py-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{formData.lat ? '✅ Location Captured' : '📍 Capture Current Location'}</span>
                  </button>
                </>
              )}
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              required
              type="email"
              placeholder="Email Address"
              className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-electricGreen text-black font-black py-4 rounded-xl text-lg hover:bg-electricGreen-dark transition-all disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 font-bold">
          {mode === 'login' ? (
            <p>New to Fleeto? <Link to="/register" className="text-electricGreen hover:underline">Register here</Link></p>
          ) : (
            <p>Already have an account? <Link to="/login" className="text-electricGreen hover:underline">Log in</Link></p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Auth
