import { useEffect, useState } from 'react'
import { User, Trash2, Shield, UserCheck, Search, Filter, Loader2 } from 'lucide-react'
import api from '../../services/api'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/users')
      setUsers(res.data.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`)
        setUsers(users.filter(u => u._id !== id))
        toast.success('User deleted successfully')
      } catch (err) {
        console.error(err)
        toast.error('Failed to delete user')
      }
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-electricGreen" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">User Directory</h1>
          <p className="text-gray-500 text-sm font-bold">Manage system-wide user accounts and roles.</p>
        </div>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold text-sm"
          />
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white border-opacity-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-[10px] font-black uppercase tracking-widest bg-white bg-opacity-5">
                <th className="p-6">User</th>
                <th className="p-6">Role</th>
                <th className="p-6">Registration</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white divide-opacity-5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-500 font-bold uppercase text-xs">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt={user.name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center font-black text-xs">
                            {user.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-500' :
                        user.role === 'dealer' ? 'bg-electricGreen/20 text-electricGreen' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

export default ManageUsers
