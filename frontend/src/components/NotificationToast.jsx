import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import socket from '../services/socket'

const NotificationToast = () => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const handleNewBooking = (data) => {
      const id = Date.now()
      setNotifications(prev => [...prev, { id, ...data }])
      
      // Auto remove after 10 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 10000)
    }

    socket.on('new_booking', handleNewBooking)
    socket.on('admin_notification', handleNewBooking)

    return () => {
      socket.off('new_booking', handleNewBooking)
      socket.off('admin_notification', handleNewBooking)
    }
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="fixed bottom-10 right-10 z-[1000] space-y-4">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="glass-panel p-6 rounded-[2rem] border border-electricGreen/30 shadow-2xl w-80 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-electricGreen"></div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-electricGreen bg-opacity-10 text-electricGreen rounded-xl">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-black uppercase tracking-tight mb-1">New Notification</h4>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">{n.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="text-[10px] font-black text-electricGreen uppercase tracking-widest hover:underline">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationToast
