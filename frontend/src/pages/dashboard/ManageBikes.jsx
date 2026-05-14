import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, ExternalLink, Zap, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'

const ManageBikes = () => {
  const { user } = useSelector((state) => state.auth)
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'City',
    price: '',
    description: '',
    range: '',
    topSpeed: '',
    battery: '',
    chargingTime: '',
    features: '',
    images: {
      front: null,
      back: null,
      left: null,
      right: null
    }
  })
  const [previews, setPreviews] = useState({
    front: null,
    back: null,
    left: null,
    right: null
  })

  useEffect(() => {
    fetchBikes()
  }, [])

  const fetchBikes = async () => {
    try {
      const res = await api.get(`/bikes?dealer=${user.id}`)
      setBikes(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('specifications', JSON.stringify({
        range: formData.range,
        topSpeed: formData.topSpeed,
        battery: formData.battery,
        chargingTime: formData.chargingTime
      }))
      formDataToSend.append('features', formData.features)
      
      // Append images in order
      if (formData.images.front) formDataToSend.append('images', formData.images.front)
      if (formData.images.back) formDataToSend.append('images', formData.images.back)
      if (formData.images.left) formDataToSend.append('images', formData.images.left)
      if (formData.images.right) formDataToSend.append('images', formData.images.right)

      await api.post('/bikes', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setShowModal(false)
      setFormData({
        name: '', category: 'City', price: '', description: '',
        range: '', topSpeed: '', battery: '', chargingTime: '',
        features: '', images: { front: null, back: null, left: null, right: null }
      })
      setPreviews({ front: null, back: null, left: null, right: null })
      fetchBikes()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to save bike')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bike?')) {
      try {
        await api.delete(`/bikes/${id}`)
        fetchBikes()
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black uppercase">Manage Inventory</h1>
          <p className="text-gray-500 text-sm font-bold">Add and manage your electric bike models.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-electricGreen text-black font-black px-8 py-4 rounded-2xl flex items-center space-x-3 hover:scale-105 transition-transform"
        >
          <Plus className="h-5 w-5" />
          <span>ADD NEW MODEL</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bikes.map((bike) => (
          <div key={bike._id} className="glass-panel rounded-3xl overflow-hidden border border-white border-opacity-5">
            <div className="aspect-video bg-darkBg-lighter flex items-center justify-center overflow-hidden">
               {bike.images && bike.images.length > 0 ? (
                 <img src={bike.images[0].url} alt={bike.name} className="w-full h-full object-cover" />
               ) : (
                 <Zap className="h-16 w-16 text-gray-800" />
               )}
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{bike.name}</h3>
                <span className="bg-electricGreen/10 text-electricGreen px-3 py-1 rounded-full text-[10px] font-black uppercase">{bike.category}</span>
              </div>
              <div className="text-2xl font-black mb-6">₹{bike.price.toLocaleString()}</div>
              
              <div className="flex items-center space-x-2">
                <button className="flex-grow flex items-center justify-center space-x-2 bg-white bg-opacity-5 hover:bg-opacity-10 p-3 rounded-xl transition-all">
                  <Edit className="h-4 w-4" />
                  <span className="text-xs font-bold">Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(bike._id)}
                  className="p-3 bg-red-500 bg-opacity-10 text-red-500 hover:bg-opacity-20 rounded-xl transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <Link to={`/bikes/${bike._id}`} className="p-3 bg-blue-500 bg-opacity-10 text-blue-500 hover:bg-opacity-20 rounded-xl transition-all">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-md"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative bg-darkBg border border-white border-opacity-10 p-10 rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
             >
               <h2 className="text-3xl font-black mb-10 uppercase">Register New Bike</h2>
               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <input 
                      required placeholder="Model Name" 
                      className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-electricGreen"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <select 
                      className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-electricGreen"
                      value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>City</option><option>Sport</option><option>Cruiser</option><option>Off-Road</option>
                    </select>
                    <input 
                      required type="number" placeholder="Price (₹)" 
                      className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-electricGreen"
                      value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                    <textarea 
                      required placeholder="Description" rows="4"
                      className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-electricGreen"
                      value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Range (km)" className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none" value={formData.range} onChange={(e) => setFormData({...formData, range: e.target.value})} />
                      <input placeholder="Top Speed (km/h)" className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none" value={formData.topSpeed} onChange={(e) => setFormData({...formData, topSpeed: e.target.value})} />
                      <input placeholder="Battery Tech" className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none" value={formData.battery} onChange={(e) => setFormData({...formData, battery: e.target.value})} />
                      <input placeholder="Charging Time" className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none" value={formData.chargingTime} onChange={(e) => setFormData({...formData, chargingTime: e.target.value})} />
                    </div>
                    <input 
                      placeholder="Features (comma separated)" 
                      className="w-full bg-darkBg-lighter border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-electricGreen"
                      value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})}
                    />
                    
                    <div className="space-y-4">
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Bike Images (4 Angles)</label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {['front', 'back', 'left', 'right'].map((side) => (
                          <div key={side} className="space-y-2">
                             <label className="block text-[10px] font-black uppercase text-gray-600">{side} View</label>
                             <input 
                              type="file" accept="image/*"
                              className="hidden" id={`image-${side}`}
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  setFormData(prev => ({
                                    ...prev,
                                    images: { ...prev.images, [side]: file }
                                  }))
                                  setPreviews(prev => ({
                                    ...prev,
                                    [side]: URL.createObjectURL(file)
                                  }))
                                }
                              }}
                            />
                            <label 
                              htmlFor={`image-${side}`} 
                              className="aspect-video bg-darkBg-lighter border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-electricGreen transition-colors overflow-hidden relative"
                            >
                              {previews[side] ? (
                                <img src={previews[side]} className="w-full h-full object-cover" alt={side} />
                              ) : (
                                <>
                                  <Plus className="h-6 w-6 text-gray-500 mb-1" />
                                  <span className="text-[10px] font-bold text-gray-500 uppercase">Add {side}</span>
                                </>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-10 flex space-x-4">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-grow p-4 rounded-xl border border-white/10 font-bold hover:bg-white/5">Cancel</button>
                      <button type="submit" className="flex-grow p-4 rounded-xl bg-electricGreen text-black font-black">Save Model</button>
                    </div>
                  </div>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageBikes
