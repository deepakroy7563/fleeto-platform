import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Zap, ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.post('/auth/forgotpassword', { email })
      if (res.data.success) {
        setSubmitted(true)
        toast.success('Reset link sent to your email')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
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
          <h2 className="text-3xl font-black uppercase">Forgot Password</h2>
          <p className="text-gray-400 mt-2">
            {submitted 
              ? "Check your email for the reset link" 
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  <span>SENDING...</span>
                </>
              ) : (
                <span>SEND RESET LINK</span>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
             <div className="h-20 w-20 bg-electricGreen/10 rounded-full flex items-center justify-center mx-auto mb-6 text-electricGreen">
                <Mail className="h-10 w-10" />
             </div>
             <p className="text-sm text-gray-400 mb-8 font-bold">
               We've sent a recovery email to <span className="text-white">{email}</span>. Please follow the instructions in the email to reset your password.
             </p>
             <button 
               onClick={() => setSubmitted(false)}
               className="text-electricGreen text-xs font-black uppercase tracking-widest hover:underline"
             >
               Didn't receive email? Try again
             </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
