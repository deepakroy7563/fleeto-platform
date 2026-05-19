import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { connectSocket, disconnectSocket } from '../services/socket'
import NotificationToast from '../components/NotificationToast'
import { 
  Zap, 
  LayoutDashboard, 
  Bike, 
  Settings, 
  LogOut, 
  MessageSquare, 
  Menu, 
  X,
  ShoppingBag,
  Users,
  User,
  ShieldCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      connectSocket(user.id, user.role)
    }
    return () => disconnectSocket()
  }, [user])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const dealerItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'My Bikes', path: '/dashboard/bikes', icon: <Bike className="h-5 w-5" /> },
    { name: 'Spare Parts', path: '/dashboard/parts', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'Bookings', path: '/dashboard/bookings', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="h-5 w-5" /> },
  ]

  const adminItems = [
    { name: 'Admin Hub', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Manage Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Approve Dealers', path: '/admin/dealers', icon: <ShieldCheck className="h-5 w-5" /> },
    { name: 'Global Fleet', path: '/admin/bikes', icon: <Bike className="h-5 w-5" /> },
    { name: 'All Bookings', path: '/admin/bookings', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="h-5 w-5" /> },
  ]

  const navItems = user?.role === 'admin' ? adminItems : dealerItems

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-darkBg flex text-white overflow-hidden relative">
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:w-20'
        } bg-darkBg-lighter border-r border-white border-opacity-5 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" onClick={handleLinkClick} className={`flex items-center space-x-3 ${!isSidebarOpen && 'md:hidden'}`}>
            <Zap className="h-8 w-8 text-electricGreen" />
            <span className="text-xl font-black tracking-tighter">FLEETO</span>
          </Link>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white hover:bg-opacity-5 rounded-lg">
            <X className="h-5 w-5 md:hidden" />
            <div className="hidden md:block">
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </div>
          </button>
        </div>

        <nav className="flex-grow px-4 mt-6 space-y-2">
          <div className={`px-4 mb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 ${!isSidebarOpen && 'md:hidden'}`}>
            {user?.role === 'admin' ? 'Administration' : 'Dealer Panel'}
          </div>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-electricGreen text-black font-black' 
                  : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className={`${!isSidebarOpen && 'md:hidden'} font-bold`}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white border-opacity-5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 p-4 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold"
          >
            <LogOut className="h-5 w-5" />
            <span className={`${!isSidebarOpen && 'md:hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="h-20 border-b border-white border-opacity-5 flex items-center justify-between px-4 sm:px-8 bg-darkBg">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 hover:bg-white/5 rounded-lg md:hidden text-gray-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight truncate">
              {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
               <div className="font-black text-sm uppercase truncate max-w-[150px]">{user?.agencyName || user?.name}</div>
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.role}</div>
             </div>
             <div className="h-10 w-10 rounded-full bg-electricGreen flex items-center justify-center text-black font-black shrink-0">
               {user?.name?.[0].toUpperCase()}
             </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto bg-darkBg custom-scrollbar">
          <Outlet />
        </div>
        <NotificationToast />
      </main>
    </div>
  )
}

export default DashboardLayout
