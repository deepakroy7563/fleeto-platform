import { Link, useLocation } from 'react-router-dom'
import { Zap, Menu, X, User as UserIcon, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Bikes', path: '/bikes' },
    { name: 'Spare Parts', path: '/parts' },
    { name: 'Find Dealer', path: '/find-dealer' },
    { name: 'Admin Panel', path: '/admin' },
    { name: 'Contact', path: '/contact' },
  ]


  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Zap className="h-8 w-8 text-electricGreen group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black tracking-tighter text-white">FLEETO</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${
                    isActive(link.path) ? 'text-electricGreen' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-3 right-3 h-0.5 bg-electricGreen"
                    />
                  )}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-6 border-l border-white/10 pl-8 ml-8">
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        location.pathname.includes('/admin') 
                        ? 'bg-red-500 text-white' 
                        : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                      }`}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Admin Hub</span>
                    </Link>
                  )}

                  <Link 
                    to={user?.role === 'dealer' ? '/dashboard' : '/profile'}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      (location.pathname.includes('/dashboard') || location.pathname === '/profile') && !location.pathname.includes('/admin')
                      ? 'bg-electricGreen text-black' 
                      : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {user?.role === 'dealer' ? 'Dashboard' : 'Profile'}
                    </span>
                  </Link>
                  <button 
                    onClick={() => dispatch(logout())}
                    className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-electricGreen text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                    isActive(link.path) ? 'bg-electricGreen/10 text-electricGreen' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-white/5">
                {isAuthenticated ? (
                  <div className="space-y-2">
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="bg-red-500/10 text-red-500 flex items-center justify-between px-6 py-5 rounded-2xl text-sm font-black uppercase tracking-widest"
                        >
                          <span>Admin Hub</span>
                          <ShieldAlert className="h-5 w-5" />
                        </Link>
                      )}
                      <Link
                        to={user?.role === 'dealer' ? '/dashboard' : '/profile'}
                        onClick={() => setIsOpen(false)}
                        className="bg-white/5 text-white flex items-center justify-between px-6 py-5 rounded-2xl text-sm font-black uppercase tracking-widest"
                      >
                        <span>{user?.role === 'dealer' ? 'Dashboard' : 'Profile'}</span>
                        <UserIcon className="h-5 w-5 text-electricGreen" />
                      </Link>
                    <button
                      onClick={() => {
                        dispatch(logout())
                        setIsOpen(false)
                      }}
                      className="w-full text-center text-red-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-electricGreen text-black block py-5 rounded-2xl text-sm font-black uppercase tracking-widest"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
