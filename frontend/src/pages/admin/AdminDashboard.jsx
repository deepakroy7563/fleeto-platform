import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ShieldCheck, Bike, MessageSquare, TrendingUp, ArrowUpRight, Activity, ShieldAlert } from 'lucide-react'
import api from '../../services/api'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState({ users: 0, dealers: 0, bikes: 0, bookings: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true)
        const res = await api.get('/users/admin/stats')
        setStats(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminStats()
  }, [])

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Platform Growth',
        data: [50, 80, 120, 190, 250, 400],
        borderColor: '#00FF41',
        backgroundColor: 'rgba(0, 255, 65, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#888',
        bodyColor: '#FFF',
        borderColor: '#333',
        borderWidth: 1,
      },
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#666' } },
      x: { grid: { display: false }, ticks: { color: '#666' } },
    },
  }

  if (loading) return (
    <div className="p-10 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 border-4 border-electricGreen border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Loading Command Center...</p>
      </div>
    </div>
  )

  return (
    <div className="p-8 space-y-10">
      {/* Admin Header */}
      <div className="glass-panel p-10 rounded-[3rem] border border-white border-opacity-5 relative overflow-hidden bg-gradient-to-br from-darkBg-lighter to-transparent">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
              <ShieldAlert className="h-3 w-3 mr-2" /> System Administrator
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Command Center</h1>
          <p className="text-gray-500 font-bold max-w-xl">Global platform oversight, user management, and agency authorizations for the Fleeto network.</p>
        </div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <Activity className="h-64 w-64 text-white" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: stats.users, icon: <Users />, path: '/admin/users' },
          { label: 'Verified Dealers', value: stats.dealers, icon: <ShieldCheck />, path: '/admin/dealers' },
          { label: 'Global Fleet', value: stats.bikes, icon: <Bike />, path: '/admin/bikes' },
          { label: 'Total Bookings', value: stats.bookings, icon: <MessageSquare />, path: '/admin/bookings' },
        ].map((stat, idx) => (
          <Link to={stat.path} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-[2.5rem] border border-white border-opacity-5 hover:border-electricGreen/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-white/5 text-gray-400 group-hover:text-electricGreen group-hover:bg-electricGreen/10 transition-all">
                  {stat.icon}
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-electricGreen transition-all" />
              </div>
              <div className="text-4xl font-black mb-2 group-hover:text-electricGreen transition-all">{stat.value}</div>
              <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Analytics & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white border-opacity-5">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-black uppercase tracking-tight">Platform Growth</h3>
             <div className="flex space-x-2">
               <span className="text-[10px] font-black text-electricGreen bg-electricGreen/10 px-2 py-1 rounded-md uppercase tracking-widest">Live</span>
             </div>
          </div>
          <Line data={lineData} options={chartOptions} />
        </div>
        
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white border-opacity-5 flex flex-col">
          <h3 className="text-lg font-black uppercase tracking-tight mb-8">Quick Actions</h3>
          <div className="space-y-4 flex-grow">
            <Link to="/admin/dealers" className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-electricGreen hover:text-black transition-all group">
              <span className="font-bold">Pending Approvals</span>
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full">New</span>
            </Link>
            <Link to="/admin/users" className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all">
              <span className="font-bold">User Directory</span>
              <Users className="h-4 w-4 text-gray-500" />
            </Link>
            <div className="p-5 rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center py-10 text-gray-600">
               <ShieldCheck className="h-8 w-8 mb-2 opacity-20" />
               <span className="text-[10px] font-black uppercase tracking-widest">System Health: 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
