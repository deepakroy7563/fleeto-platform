import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Zap, ShieldCheck, Loader2 } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-hot-toast'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    try {
      setLoading(true)
      const res = await api.put(`/auth/resetpassword/${token}`, { password })
      if (res.data.success) {
        toast.success('Password reset successfully')
        navigate('/login')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Token is invalid or has expired')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electricGreen opacity-10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-panel p-10 rounded-[3rem] border border-white border-opacity-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Zap className="h-8 w-8 text-electricGreen" />
            <span className="text-2xl font-black tracking-tighter">FLEETO</span>
          </Link>
          <h2 className="text-3xl font-black uppercase">Reset Password</h2>
          <p className="text-gray-400 mt-2">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              required
              type="password"
              placeholder="New Password"
              minLength={6}
              className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              required
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-electricGreen text-black font-black py-4 rounded-xl text-lg hover:bg-electricGreen-dark transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>RESETTING...</span>
              </>
            ) : (
              <span>RESET PASSWORD</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ResetPassword
