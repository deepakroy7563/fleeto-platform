import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBikeById } from '../features/bikes/bikeSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Battery, Gauge, Timer, Weight, Shield, ArrowLeft, MessageCircle, Star, Play, X, CheckCircle2 } from 'lucide-react'
import api from '../services/api'

const BikeDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentBike: bike, loading, error } = useSelector((state) => state.bikes)
  const [activeTab, setActiveTab] = useState('specs')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingData, setBookingData] = useState({ name: '', phone: '', message: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    dispatch(fetchBikeById(id))
  }, [dispatch, id])

  const handleBooking = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    try {
      const res = await api.post('/bookings', {
        bikeId: id,
        customerName: bookingData.name,
        customerPhone: bookingData.phone,
        message: bookingData.message
      })
      if (res.data.whatsappLink) {
        window.open(res.data.whatsappLink, '_blank')
        setShowBookingModal(false)
      }
    } catch (err) {
      console.error('Booking failed', err)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  if (!bike) return null

  return (
    <div className="pt-24 pb-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <Link to="/bikes" className="inline-flex items-center space-x-3 text-gray-500 hover:text-electricGreen mb-12 group transition-all">
          <div className="p-2 rounded-lg border border-white border-opacity-10 group-hover:border-electricGreen">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="font-black text-xs tracking-widest uppercase">The Fleet</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: Media Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square glass-panel rounded-[3.5rem] border border-white border-opacity-5 p-12 flex items-center justify-center overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  src={bike.images?.[selectedImage]?.url || 'https://via.placeholder.com/800x800?text=Fleeto+Electric+Bike'}
                  alt={bike.name}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
              
              {bike.videoUrl && (
                <button 
                  onClick={() => setShowVideo(true)}
                  className="absolute bottom-10 right-10 bg-white text-black p-5 rounded-full shadow-2xl hover:bg-electricGreen hover:scale-110 transition-all z-20 group"
                >
                  <Play className="h-6 w-6 fill-current" />
                </button>
              )}
              
              <div className="absolute top-10 left-10">
                <span className="bg-electricGreen text-black font-black px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest">{bike.category}</span>
              </div>
            </motion.div>
            
            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {bike.images?.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-[1.5rem] border-2 transition-all overflow-hidden p-2 bg-darkBg-lighter ${
                    selectedImage === idx ? 'border-electricGreen' : 'border-transparent hover:border-white/20'
                  }`}
                >
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
              {/* Placeholder thumbnails if images are few */}
              {Array.from({ length: Math.max(0, 4 - (bike.images?.length || 0)) }).map((_, i) => (
                <div key={i} className="aspect-square rounded-[1.5rem] bg-darkBg-lighter border border-white/5 border-dashed"></div>
              ))}
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-none">{bike.name}</h1>
              
              <div className="flex items-center space-x-6 mb-10 pb-10 border-b border-white/5">
                 <div className="text-4xl font-black text-electricGreen">₹{bike.price.toLocaleString()}</div>
                 <div className="h-8 w-[1px] bg-white/10"></div>
                 <div className="flex items-center space-x-2">
                   <Star className="h-5 w-5 text-yellow-500 fill-current" />
                   <span className="font-black text-lg">4.9</span>
                   <span className="text-gray-500 font-bold">(120 Reviews)</span>
                 </div>
              </div>

              <p className="text-xl text-gray-400 mb-12 font-medium leading-relaxed">{bike.description}</p>

              {/* Core Specs Grid */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-darkBg-lighter rounded-3xl border border-white/5 text-center">
                  <Battery className="h-6 w-6 text-electricGreen mx-auto mb-3" />
                  <div className="text-xl font-black">{bike.specifications.range}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Range</div>
                </div>
                <div className="p-6 bg-darkBg-lighter rounded-3xl border border-white/5 text-center">
                  <Gauge className="h-6 w-6 text-electricGreen mx-auto mb-3" />
                  <div className="text-xl font-black">{bike.specifications.topSpeed}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Speed</div>
                </div>
                <div className="p-6 bg-darkBg-lighter rounded-3xl border border-white/5 text-center">
                  <Timer className="h-6 w-6 text-electricGreen mx-auto mb-3" />
                  <div className="text-xl font-black">{bike.specifications.chargingTime}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Charge</div>
                </div>
              </div>

              {/* Booking CTA */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-electricGreen text-black font-black py-7 rounded-[2rem] text-xl flex items-center justify-center space-x-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,65,0.2)]"
              >
                <MessageCircle className="h-7 w-7" />
                <span>BOOK TEST RIDE</span>
              </button>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="flex items-center space-x-3 text-xs text-gray-500 font-black uppercase">
                    <Shield className="h-4 w-4 text-electricGreen" />
                    <span>2 Year Warranty</span>
                 </div>
                 <div className="flex items-center space-x-3 text-xs text-gray-500 font-black uppercase">
                    <Zap className="h-4 w-4 text-electricGreen" />
                    <span>Instant Delivery</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="mt-40">
          <div className="flex items-center space-x-12 border-b border-white/5 mb-16 overflow-x-auto pb-0">
            {['specs', 'features', 'dealer'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-8 font-black uppercase tracking-widest text-sm relative transition-colors ${
                  activeTab === tab ? 'text-electricGreen' : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab === 'specs' ? 'Specifications' : tab.toUpperCase()}
                {activeTab === tab && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-electricGreen" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
             {activeTab === 'specs' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8">
                  {Object.entries(bike.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-6 border-b border-white/5">
                      <span className="text-gray-500 font-black text-xs uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-xl font-black">{value}</span>
                    </div>
                  ))}
               </div>
             )}
             {activeTab === 'features' && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {bike.features.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 glass-panel rounded-3xl border border-white/5"
                    >
                      <CheckCircle2 className="h-6 w-6 text-electricGreen mb-4" />
                      <h4 className="text-lg font-black">{feature}</h4>
                    </motion.div>
                  ))}
               </div>
             )}
             {activeTab === 'dealer' && (
               <div className="glass-panel p-12 rounded-[3.5rem] border border-white/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex items-center space-x-8">
                      <div className="h-24 w-24 bg-electricGreen text-black rounded-3xl flex items-center justify-center">
                         <Zap className="h-12 w-12" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black uppercase mb-2">{bike.dealer.agencyName || bike.dealer.name}</h4>
                        <div className="text-gray-500 font-black text-sm tracking-widest">{bike.dealer.location?.address || 'Official Fleeto Hub'}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="px-8 py-4 bg-darkBg rounded-2xl border border-white/5 text-center">
                        <div className="text-[10px] text-gray-600 uppercase font-black mb-1">Direct Phone</div>
                        <div className="text-xl font-black">{bike.dealer.phone}</div>
                      </div>
                      <button 
                        onClick={() => {
                          const lat = bike.dealer.location?.coordinates?.[1];
                          const lng = bike.dealer.location?.coordinates?.[0];
                          const address = bike.dealer.location?.address;
                          if (lat && lng) {
                            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                          } else if (address) {
                            window.open(`https://www.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
                          } else {
                            alert("Dealer location not available");
                          }
                        }}
                        className="px-8 py-4 bg-white text-black rounded-2xl font-black text-sm hover:bg-electricGreen transition-colors"
                      >
                        GET DIRECTIONS
                      </button>
                    </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Video Overlay */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-20 bg-black/95 backdrop-blur-xl"
          >
            <button onClick={() => setShowVideo(false)} className="absolute top-10 right-10 text-white hover:text-electricGreen z-10">
              <X className="h-10 w-10" />
            </button>
            <div className="w-full h-full max-w-6xl aspect-video glass-panel rounded-[3rem] overflow-hidden relative">
               <iframe 
                className="w-full h-full"
                src={bike.videoUrl.replace('watch?v=', 'embed/')} 
                title="Bike Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
               ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-darkBg border border-white/10 p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-electricGreen"></div>
              <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">RESERVE NOW.</h2>
              <p className="text-gray-500 mb-10 font-bold">Start your electric journey with a test ride.</p>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <input
                  required
                  type="text"
                  placeholder="FULL NAME"
                  className="w-full bg-darkBg-lighter border border-white/10 rounded-2xl p-5 focus:border-electricGreen outline-none transition-all font-black text-sm"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                />
                <input
                  required
                  type="tel"
                  placeholder="PHONE NUMBER"
                  className="w-full bg-darkBg-lighter border border-white/10 rounded-2xl p-5 focus:border-electricGreen outline-none transition-all font-black text-sm"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                />
                <textarea
                  rows="3"
                  placeholder="SPECIAL REQUESTS (OPTIONAL)"
                  className="w-full bg-darkBg-lighter border border-white/10 rounded-2xl p-5 focus:border-electricGreen outline-none transition-all font-black text-sm"
                  value={bookingData.message}
                  onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                ></textarea>
                
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-electricGreen text-black font-black py-6 rounded-2xl text-xl hover:bg-electricGreen-dark transition-all disabled:opacity-50"
                >
                  {bookingLoading ? 'CONNECTING...' : 'OPEN WHATSAPP'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BikeDetail
