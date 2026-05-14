import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Zap } from 'lucide-react'
import MapSection from '../components/MapSection'
import { useState, useEffect } from 'react'
import api from '../services/api'

const Contact = () => {
  const [dealers, setDealers] = useState([])
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const res = await api.get('/auth/profile') // Placeholder for dealer fetching logic
        // Mocking dealers for demo
        setDealers([
          { agencyName: 'Fleeto Delhi Central', name: 'Arjun Singh', phone: '+91 98765 43210', location: { address: 'Plot 42, Okhla Industrial Area, Phase 3, New Delhi' } },
          { agencyName: 'Green Wheels Mumbai', name: 'Priya Sharma', phone: '+91 91234 56789', location: { address: 'Sector 15, Vashi, Navi Mumbai' } },
          { agencyName: 'EcoRide Bangalore', name: 'Rahul Reddy', phone: '+91 80500 12345', location: { address: 'Indiranagar 100ft Road, Bangalore' } },
        ])
      } catch (err) {
        console.error(err)
      }
    }
    fetchDealers()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message sent! Our team will contact you shortly.')
  }

  return (
    <div className="pt-24 bg-darkBg overflow-hidden">
      {/* Hero Header */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-electricGreen font-black tracking-widest text-xs uppercase mb-4 block">Get In Touch</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">CONNECT WITH <span className="text-electricGreen">US.</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">Have questions about our bikes or interested in becoming a dealer? We're here to help.</p>
          </motion.div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-electricGreen/5 blur-[120px] rounded-full -z-10"></div>
      </section>

      {/* Contact Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info Side */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: <Mail />, title: 'Email Us', info: 'support@fleeto.ev', sub: '24/7 Response' },
                { icon: <Phone />, title: 'Call Center', info: '+91 1800 500 200', sub: 'Mon-Sat, 9AM-8PM' },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="glass-panel p-8 rounded-3xl border border-white/5"
                >
                  <div className="p-4 bg-white/5 text-electricGreen rounded-2xl w-fit mb-6">{item.icon}</div>
                  <h4 className="text-xl font-black uppercase mb-1">{item.title}</h4>
                  <div className="text-white font-bold">{item.info}</div>
                  <div className="text-gray-500 text-xs mt-1">{item.sub}</div>
                </motion.div>
              ))}
            </div>

            <div className="glass-panel p-10 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
              <Zap className="h-10 w-10 text-electricGreen mb-6" />
              <h3 className="text-3xl font-black uppercase mb-4">HEADQUARTERS</h3>
              <div className="flex items-start space-x-4 text-gray-400 leading-relaxed">
                <MapPin className="h-6 w-6 text-electricGreen shrink-0 mt-1" />
                <p className="text-lg">Fleeto Innovation Center, <br />Cyber City Hub, Tower B-12, <br />Gurgaon, Haryana, 122002</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-10 md:p-16 rounded-[4rem] border border-white/10"
          >
            <h3 className="text-3xl font-black uppercase mb-8">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Full Name</label>
                <input 
                  required type="text" placeholder="Your Name" 
                  className="w-full bg-darkBg-lighter border border-white/5 rounded-2xl p-5 focus:border-electricGreen outline-none transition-all font-black text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Email Address</label>
                <input 
                  required type="email" placeholder="email@example.com" 
                  className="w-full bg-darkBg-lighter border border-white/5 rounded-2xl p-5 focus:border-electricGreen outline-none transition-all font-black text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Your Message</label>
                <textarea 
                  required rows="5" placeholder="How can we help you?" 
                  className="w-full bg-darkBg-lighter border border-white/5 rounded-2xl p-5 focus:border-electricGreen outline-none transition-all font-black text-sm"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-electricGreen text-black font-black py-6 rounded-2xl text-lg flex items-center justify-center space-x-3 hover:bg-white transition-all group"
              >
                <span>SEND MESSAGE</span>
                <Send className="h-5 w-5 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <MapSection locations={dealers} />
    </div>
  )
}

export default Contact
