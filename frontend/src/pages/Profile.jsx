import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { updateProfile, updateAvatar, clearError } from '../features/auth/authSlice'
import { motion } from 'framer-motion'
import { User, Phone, Mail, Shield, Save, Camera, CheckCircle, MapPin, Navigation, Loader2 } from 'lucide-react'

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    agencyName: user?.agencyName || '',
    email: user?.email || '',
    address: user?.location?.address || '',
    lat: user?.location?.coordinates?.[1] || '',
    lng: user?.location?.coordinates?.[0] || '',
  })

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6),
          }))
        },
        (err) => {
          console.error(err)
          alert("Unable to retrieve your location. Please check your browser permissions.")
        }
      )
    } else {
      alert("Geolocation is not supported by your browser.")
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (location.state?.autoLocate || params.get('autoLocate') === 'true') {
       handleLocateMe()
    }
  }, [location])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        agencyName: user.agencyName || '',
        email: user.email,
        address: user.location?.address || '',
        lat: user.location?.coordinates?.[1] || '',
        lng: user.location?.coordinates?.[0] || '',
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    const result = await dispatch(updateProfile({
      name: formData.name,
      phone: formData.phone,
      agencyName: formData.agencyName,
      location: {
        address: formData.address,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      }
    }))
    
    if (updateProfile.fulfilled.match(result)) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)
    
    const result = await dispatch(updateAvatar(formData))
    if (updateAvatar.fulfilled.match(result)) {
       setSuccess(true)
       setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter">My <span className="text-electricGreen">Profile</span></h1>
        <p className="text-gray-500 font-bold">Manage your account settings and business information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-electricGreen/10 to-transparent"></div>
            
            <div className="relative mb-6 inline-block group">
              <div className="h-32 w-32 bg-darkBg-lighter rounded-full border-4 border-electricGreen flex items-center justify-center overflow-hidden mx-auto relative">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-gray-700" />
                )}
                {loading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-electricGreen animate-spin" />
                  </div>
                )}
              </div>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-3 bg-electricGreen text-black rounded-full shadow-xl hover:scale-110 transition-transform cursor-pointer">
                <Camera className="h-4 w-4" />
                <input 
                  type="file" 
                  id="avatar-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            <h3 className="text-2xl font-black uppercase truncate">{user?.name}</h3>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{user?.role}</p>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
               <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                  <span>Status</span>
                  <span className={user?.isApproved ? "text-electricGreen" : "text-yellow-500"}>
                    {user?.isApproved ? "Verified" : "Pending Approval"}
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-10 rounded-[3rem] border border-white/5"
          >
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-electricGreen/10 border border-electricGreen/50 text-electricGreen rounded-2xl flex items-center space-x-3 text-sm font-black uppercase tracking-widest"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Profile Updated Successfully</span>
              </motion.div>
            )}

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-darkBg-lighter border border-white/5 rounded-2xl p-4 pl-12 focus:border-electricGreen outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-darkBg-lighter border border-white/5 rounded-2xl p-4 pl-12 focus:border-electricGreen outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Email Address (Read Only)</label>
                  <div className="relative opacity-50">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input 
                      type="email" 
                      disabled
                      value={formData.email}
                      className="w-full bg-darkBg-lighter border border-white/5 rounded-2xl p-4 pl-12 font-bold text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {user?.role === 'dealer' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Agency Name</label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input 
                          type="text" 
                          value={formData.agencyName}
                          onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                          className="w-full bg-darkBg-lighter border border-white/5 rounded-2xl p-4 pl-12 focus:border-electricGreen outline-none transition-all font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Physical Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input 
                          type="text" 
                          placeholder="e.g. 123 Electric Ave, New York"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full bg-darkBg-lighter border border-white/5 rounded-2xl p-4 pl-12 focus:border-electricGreen outline-none transition-all font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Agency Location</label>
                      <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-darkBg-lighter flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${formData.lat ? 'bg-electricGreen/20 text-electricGreen' : 'bg-gray-500/10 text-gray-500'}`}>
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-tight">
                              {formData.lat ? 'Location Tagged' : 'Location Not Set'}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold">
                              {formData.lat ? `${formData.lat}, ${formData.lng}` : 'Use the button to find your agency on the map'}
                            </p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={handleLocateMe}
                          className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2"
                        >
                          <Navigation className="h-3 w-3 text-electricGreen" />
                          <span>Find Location</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-electricGreen text-black font-black px-10 py-5 rounded-2xl text-sm flex items-center space-x-3 hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'SAVING...' : 'SAVE CHANGES'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
