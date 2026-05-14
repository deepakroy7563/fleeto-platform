import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ShoppingBag, MessageSquare, Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import api from '../../services/api'
import { useSelector } from 'react-redux'

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
          api.get(`/bikes?dealer=${user.id}`)
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
    <div className="p-4 md:p-10 bg-darkBg min-h-screen pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase">Dealer Dashboard</h1>
            <p className="text-gray-500 font-bold">Welcome back, {user.agencyName || user.name}</p>
          </div>
          <button className="bg-electricGreen text-black font-black px-6 py-3 rounded-xl flex items-center space-x-2 hover:scale-105 transition-transform">
            <Plus className="h-5 w-5" />
            <span>ADD NEW BIKE</span>
          </button>
          <Link to="/profile?autoLocate=true" className="ml-4 bg-white/5 text-white border border-white/10 font-black px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-white/10 transition-all">
            <Edit className="h-5 w-5 text-electricGreen" />
            <span>MANAGE LOCATION</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Bikes', value: stats.bikes, icon: <Zap />, color: 'text-blue-500' },
            { label: 'Total Bookings', value: stats.bookings, icon: <MessageSquare />, color: 'text-electricGreen' },
            { label: 'Spare Parts', value: stats.parts, icon: <ShoppingBag />, color: 'text-purple-500' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-white border-opacity-5">
              <div className={`${stat.color} mb-4`}>{stat.icon}</div>
              <div className="text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs font-black uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Bookings Table */}
        <div className="glass-panel rounded-3xl overflow-hidden mb-12 border border-white border-opacity-5">
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
                        <button onClick={() => updateStatus(booking._id, 'completed')} className="text-gray-500 hover:text-electricGreen"><CheckCircle className="h-5 w-5" /></button>
                        <button onClick={() => updateStatus(booking._id, 'cancelled')} className="text-gray-500 hover:text-red-500"><XCircle className="h-5 w-5" /></button>
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
