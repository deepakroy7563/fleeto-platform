import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, MapPin, User, ShieldCheck } from 'lucide-react'
import api from '../../services/api'
import { motion } from 'framer-motion'

const ManageDealers = () => {
  const [dealers, setDealers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDealers()
  }, [])

  const fetchDealers = async () => {
    try {
      // In a real app, you'd have an endpoint for this, e.g., /admin/dealers
      const res = await api.get('/auth/profile') // Placeholder for all dealers
      // For demo, I'll assume we fetch a list of users filtered by role=dealer
      // setDealers(res.data.data)
      setDealers([
        { _id: '1', name: 'John Doe', agencyName: 'Electric Hub', email: 'john@hub.com', isApproved: false, createdAt: new Date() },
        { _id: '2', name: 'Jane Smith', agencyName: 'Green Ride', email: 'jane@green.com', isApproved: true, createdAt: new Date() },
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (id, currentStatus) => {
    try {
      // await api.put(`/admin/dealers/${id}/approve`, { isApproved: !currentStatus })
      setDealers(dealers.map(d => d._id === id ? { ...d, isApproved: !currentStatus } : d))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-2xl font-black uppercase">Dealer Approvals</h1>
        <p className="text-gray-500 text-sm font-bold">Review and authorize new bike agencies on the platform.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white border-opacity-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs font-black uppercase tracking-widest bg-white bg-opacity-5">
                <th className="p-6">Agency Info</th>
                <th className="p-6">Owner</th>
                <th className="p-6">Joined Date</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white divide-opacity-5">
              {dealers.map((dealer) => (
                <tr key={dealer._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-electricGreen bg-opacity-10 rounded-xl flex items-center justify-center text-electricGreen">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold">{dealer.agencyName}</div>
                        <div className="text-xs text-gray-500">{dealer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 font-bold">{dealer.name}</td>
                  <td className="p-6 text-sm text-gray-400">{new Date(dealer.createdAt).toLocaleDateString()}</td>
                  <td className="p-6">
                    {dealer.isApproved ? (
                      <span className="flex items-center space-x-2 text-green-500 text-xs font-black uppercase tracking-widest">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2 text-yellow-500 text-xs font-black uppercase tracking-widest">
                        <Clock className="h-4 w-4" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => toggleApproval(dealer._id, dealer.isApproved)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        dealer.isApproved 
                          ? 'bg-red-500 bg-opacity-10 text-red-500 hover:bg-red-500 hover:text-white' 
                          : 'bg-electricGreen text-black hover:bg-electricGreen-dark'
                      }`}
                    >
                      {dealer.isApproved ? 'Revoke' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageDealers
