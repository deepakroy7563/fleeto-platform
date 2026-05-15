import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Bikes from './pages/Bikes'
import BikeDetail from './pages/BikeDetail'
import SpareParts from './pages/SpareParts'
import DealerDashboard from './pages/dashboard/DealerDashboard'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import ManageBikes from './pages/dashboard/ManageBikes'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDealers from './pages/admin/ManageDealers'
import ManageUsers from './pages/admin/ManageUsers'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import DealerLocator from './pages/DealerLocator'
import Auth from './pages/Auth'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getProfile } from './features/auth/authSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(getProfile())
    }
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="bikes" element={<Bikes />} />
        <Route path="bikes/:id" element={<BikeDetail />} />
        <Route path="parts" element={<SpareParts />} />
        <Route path="find-dealer" element={<DealerLocator />} />
        <Route path="contact" element={<Contact />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="login" element={<Auth mode="login" />} />
        <Route path="register" element={<Auth mode="register" />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['dealer', 'admin']} />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="bikes" element={<ManageBikes />} />
            <Route path="parts" element={<div className="p-10">Manage Parts (Coming Soon)</div>} />
            <Route path="bookings" element={<DealerDashboard />} />
          </Route>
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="dealers" element={<ManageDealers />} />
            <Route path="bikes" element={<ManageBikes />} />
            <Route path="bookings" element={<DealerDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
