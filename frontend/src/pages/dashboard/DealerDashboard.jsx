import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ShoppingBag, MessageSquare, Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import api from '../../services/api'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const DealerDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState({ bikes: 0, bookings: 0, parts: 0 })
  const [bookings, setBookings] = useState([])
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, bikesRes] = await Promise.all([
          api.get('/bookings'),
          user.role === 'dealer' ? api.get(`/bikes?dealer=${user.id}`) : api.get('/bikes')
        ])
        setBookings(bookingsRes.data.data)
        setBikes(bikesRes.data.data)
        setStats({
          bookings: bookingsRes.data.count,
          bikes: bikesRes.data.count,
          parts: 0 // Fetch parts stats later
        })
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status })
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b))
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  if (loading) return <div className="p-10">Loading Dashboard...</div>

  return (
    <div className="p-4 md:p-8 space-y-8 bg-darkBg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">
              {user.role === 'admin' ? 'Global Bookings' : 'Dealer Dashboard'}
            </h1>
            <p className="text-gray-500 font-bold text-sm">
              {user.role === 'admin' ? 'Managing all platform inquiries' : `Welcome back, ${user.agencyName || user.name}`}
            </p>
          </div>
          {user.role === 'dealer' && (
            <div className="flex flex-wrap gap-3">
              <button className="bg-electricGreen text-black font-black px-5 py-3 rounded-xl flex items-center space-x-2 hover:scale-105 transition-transform text-xs uppercase tracking-wider">
                <Plus className="h-4 w-4" />
                <span>ADD NEW BIKE</span>
              </button>
              <Link to="/profile?autoLocate=true" className="bg-white/5 text-white border border-white/10 font-black px-5 py-3 rounded-xl flex items-center space-x-2 hover:bg-white/10 transition-all text-xs uppercase tracking-wider">
                <Edit className="h-4 w-4 text-electricGreen" />
                <span>MANAGE LOCATION</span>
              </Link>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: user.role === 'admin' ? 'Total Fleet' : 'Total Bikes', value: stats.bikes, icon: <Zap />, color: 'text-blue-500 bg-blue-500/10' },
            { label: 'Total Bookings', value: stats.bookings, icon: <MessageSquare />, color: 'text-electricGreen bg-electricGreen/10' },
            { label: 'Spare Parts', value: stats.parts, icon: <ShoppingBag />, color: 'text-purple-500 bg-purple-500/10' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl border border-white border-opacity-5 flex items-center justify-between">
              <div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color} shrink-0`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Inquiries List / Cards on Mobile */}
        <div className="block md:hidden mb-12 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 mb-4">
            <h2 className="text-lg font-black uppercase text-white">Recent Inquiries</h2>
          </div>
          {bookings.length === 0 ? (
            <div className="glass-panel p-10 text-center text-gray-500 font-bold uppercase text-xs rounded-2xl">
              No inquiries found
            </div>
          ) : (
            bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col space-y-4 hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white text-base">{booking.customerName}</div>
                    <div className="text-xs text-gray-400">{booking.customerPhone}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    booking.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 text-sm">
                  <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Bike Model</div>
                    <div className="font-bold text-white truncate">{booking.bike?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Inquiry Date</div>
                    <div className="text-xs text-gray-300 font-bold">{new Date(booking.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {user.role === 'dealer' && booking.status === 'pending' && (
                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button 
                      onClick={() => updateStatus(booking._id, 'completed')} 
                      className="px-4 py-2 bg-electricGreen text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-electricGreen/90 transition-all flex items-center space-x-1.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Complete</span>
                    </button>
                    <button 
                      onClick={() => updateStatus(booking._id, 'cancelled')} 
                      className="px-4 py-2 bg-red-500 bg-opacity-10 text-red-500 hover:bg-red-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center space-x-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Recent Bookings Table for Desktop */}
        <div className="hidden md:block glass-panel rounded-3xl overflow-hidden mb-12 border border-white border-opacity-5">
          <div className="p-8 border-b border-white border-opacity-5">
            <h2 className="text-xl font-black uppercase">Recent Inquiries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs font-black uppercase tracking-widest bg-white bg-opacity-5">
                  <th className="p-6">Customer</th>
                  <th className="p-6">Bike</th>
                  <th className="p-6">Date</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white divide-opacity-5">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                    <td className="p-6">
                      <div className="font-bold">{booking.customerName}</div>
                      <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                    </td>
                    <td className="p-6 font-bold">{booking.bike?.name}</td>
                    <td className="p-6 text-sm text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        booking.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                        booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        {user.role === 'dealer' && (
                          <>
                            <button onClick={() => updateStatus(booking._id, 'completed')} className="text-gray-500 hover:text-electricGreen" title="Complete"><CheckCircle className="h-5 w-5" /></button>
                            <button onClick={() => updateStatus(booking._id, 'cancelled')} className="text-gray-500 hover:text-red-500" title="Cancel"><XCircle className="h-5 w-5" /></button>
                          </>
                        )}
                        {user.role === 'admin' && (
                           <div className="text-[10px] text-gray-600 font-bold uppercase">View Only</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealerDashboard
