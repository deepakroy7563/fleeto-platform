import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, MessageSquare, ShoppingBag, TrendingUp, ArrowUpRight, MapPin } from 'lucide-react'
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

const DashboardOverview = () => {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState({ bikes: 0, bookings: 0, parts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, bikesRes] = await Promise.all([
          api.get('/bookings'),
          api.get(`/bikes?dealer=${user.id}`)
        ])
        setStats({
          bookings: bookingsRes.data.count,
          bikes: bikesRes.data.count,
          parts: 12 // Placeholder for parts
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user])

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Bookings',
        data: [12, 19, 15, 22, 18, 30],
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
        mode: 'index',
        intersect: false,
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

  if (loading) return <div className="p-10">Loading Stats...</div>

  return (
    <div className="p-8 space-y-10">
      {/* Welcome Card */}
      <div className="glass-panel p-10 rounded-[3rem] border border-white border-opacity-5 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 uppercase">Business Insights</h1>
          <p className="text-gray-500 font-bold">Comprehensive overview of your Fleeto agency performance.</p>
        </div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-10">
          <TrendingUp className="h-40 w-40 text-electricGreen" />
        </div>
      </div>

      {/* Location Nudge for Dealers */}
      {user?.role === 'dealer' && !user?.location?.address && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-electricGreen/10 border border-electricGreen/50 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-electricGreen p-3 rounded-xl text-black">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-tight">Your Agency is not on the map!</h4>
              <p className="text-gray-400 text-sm font-bold">Set your location so customers can find your showroom.</p>
            </div>
          </div>
          <Link 
            to="/profile" 
            state={{ autoLocate: true }}
            className="bg-electricGreen text-black font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            Set My Location
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Models', value: stats.bikes, icon: <Zap />, change: '+2 new this month' },
          { label: 'Total Inquiries', value: stats.bookings, icon: <MessageSquare />, change: '+15% from last week' },
          { label: 'Spare Inventory', value: stats.parts, icon: <ShoppingBag />, change: '85% stock efficiency' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white border-opacity-5"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 rounded-2xl bg-electricGreen bg-opacity-10 text-electricGreen">
                {stat.icon}
              </div>
              <span className="text-xs font-black text-electricGreen flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> {stat.change}
              </span>
            </div>
            <div className="text-4xl font-black mb-2">{stat.value}</div>
            <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white border-opacity-5">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-black uppercase tracking-tight">Booking Trends</h3>
             <select className="bg-darkBg border border-white/10 rounded-lg px-3 py-1 text-xs font-bold outline-none">
               <option>Last 6 Months</option>
               <option>Last Year</option>
             </select>
          </div>
          <Line data={lineData} options={chartOptions} />
        </div>
        
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white border-opacity-5">
          <h3 className="text-lg font-black uppercase tracking-tight mb-8">Inventory Distribution</h3>
          <Bar 
            data={{
              labels: ['City', 'Sport', 'Cruiser', 'Off-Road'],
              datasets: [{
                data: [5, 12, 8, 4],
                backgroundColor: '#00FF41',
                borderRadius: 8
              }]
            }} 
            options={chartOptions} 
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
