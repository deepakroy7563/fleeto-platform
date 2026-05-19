import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, MapPin, User, ShieldCheck, Loader2 } from 'lucide-react'
import api from '../../services/api'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

const ManageDealers = () => {
  const [dealers, setDealers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDealers()
  }, [])

  const fetchDealers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/users/admin/dealers')
      setDealers(res.data.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch dealers')
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (id, currentStatus) => {
    try {
      const res = await api.put(`/users/${id}/status`, { isApproved: !currentStatus })
      if (res.data.success) {
        setDealers(dealers.map(d => d._id === id ? { ...d, isApproved: !currentStatus } : d))
        toast.success(`Dealer ${!currentStatus ? 'approved' : 'revoked'} successfully`)
      }
    } catch (err) {
      console.error(err)
      toast.error('Action failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-electricGreen" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Dealer Approvals</h1>
        <p className="text-gray-500 text-sm font-bold">Review and authorize new bike agencies on the platform.</p>
      </div>

      {/* Mobile Card Grid Layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {dealers.length === 0 ? (
          <div className="glass-panel p-10 text-center text-gray-500 font-bold uppercase text-xs rounded-2xl">
            No dealers found
          </div>
        ) : (
          dealers.map((dealer) => (
            <div 
              key={dealer._id} 
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col space-y-4 hover:border-white/10 transition-colors"
            >
              {/* Agency Info */}
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-electricGreen bg-opacity-10 rounded-xl flex items-center justify-center text-electricGreen shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-base text-white truncate">{dealer.agencyName || 'N/A'}</div>
                  <div className="text-xs text-gray-400 truncate">{dealer.email}</div>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                <div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Owner</div>
                  <div className="text-sm font-bold text-white truncate">{dealer.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Joined</div>
                  <div className="text-xs text-gray-300 font-bold">{new Date(dealer.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Status and Action Row */}
              <div className="flex items-center justify-between">
                <div>
                  {dealer.isApproved ? (
                    <span className="flex items-center space-x-1.5 text-green-500 text-[9px] font-black uppercase tracking-widest bg-green-500/10 px-2.5 py-1 rounded-full w-fit">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5 text-yellow-500 text-[9px] font-black uppercase tracking-widest bg-yellow-500/10 px-2.5 py-1 rounded-full w-fit">
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => toggleApproval(dealer._id, dealer.isApproved)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    dealer.isApproved 
                      ? 'bg-red-500 bg-opacity-10 text-red-500 hover:bg-red-500 hover:text-white' 
                      : 'bg-electricGreen text-black hover:bg-electricGreen/90'
                  }`}
                >
                  {dealer.isApproved ? 'Revoke' : 'Approve'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block glass-panel rounded-3xl overflow-hidden border border-white border-opacity-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-[10px] font-black uppercase tracking-widest bg-white bg-opacity-5">
                <th className="p-6">Agency Info</th>
                <th className="p-6">Owner</th>
                <th className="p-6">Joined Date</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white divide-opacity-5">
              {dealers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500 font-bold uppercase text-xs">No dealers found</td>
                </tr>
              ) : (
                dealers.map((dealer) => (
                  <tr key={dealer._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-electricGreen bg-opacity-10 rounded-xl flex items-center justify-center text-electricGreen">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold">{dealer.agencyName || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{dealer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-bold">{dealer.name}</td>
                    <td className="p-6 text-sm text-gray-400">{new Date(dealer.createdAt).toLocaleDateString()}</td>
                    <td className="p-6">
                      {dealer.isApproved ? (
                        <span className="flex items-center space-x-2 text-green-500 text-[9px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full w-fit">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2 text-yellow-500 text-[9px] font-black uppercase tracking-widest bg-yellow-500/10 px-3 py-1 rounded-full w-fit">
                          <Clock className="h-3 w-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => toggleApproval(dealer._id, dealer.isApproved)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          dealer.isApproved 
                            ? 'bg-red-500 bg-opacity-10 text-red-500 hover:bg-red-500 hover:text-white' 
                            : 'bg-electricGreen text-black hover:bg-electricGreen/90'
                        }`}
                      >
                        {dealer.isApproved ? 'Revoke' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageDealers
