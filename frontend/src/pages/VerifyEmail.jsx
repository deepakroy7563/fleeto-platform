import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Zap, ArrowLeft, Mail } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-hot-toast'

const VerifyEmail = () => {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`)
        if (res.data.success) {
          setStatus('success')
          toast.success('Email verified successfully!')
        }
      } catch (err) {
        setStatus('failed')
        setErrorMessage(err.response?.data?.message || 'The verification link is invalid or has expired.')
      }
    }

    if (token) {
      verifyToken()
    }
  }, [token])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleResend = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    try {
      setResending(true)
      const res = await api.post('/auth/resend-verification', { email })
      if (res.data.success) {
        toast.success('New verification link sent to your email!')
        setCooldown(60)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification link')
    } finally {
      setResending(false)
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
        className="relative z-10 w-full max-w-md glass-panel p-10 rounded-[3rem] border border-white border-opacity-10 text-center"
      >
        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
          <Zap className="h-8 w-8 text-electricGreen" />
          <span className="text-2xl font-black tracking-tighter">FLEETO</span>
        </Link>

        {status === 'loading' && (
          <div className="py-10">
            <Loader2 className="h-16 w-16 text-electricGreen animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase text-white mb-2">Verifying Email...</h2>
            <p className="text-gray-400 font-bold text-sm">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="h-20 w-20 bg-electricGreen/10 rounded-full flex items-center justify-center mx-auto mb-6 text-electricGreen animate-bounce">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-black uppercase text-white mb-4">Email Verified!</h2>
            <p className="text-gray-400 font-bold mb-8 leading-relaxed text-sm">
              Your email has been verified successfully. Your account is now active and ready.
            </p>
            <Link
              to="/login"
              className="w-full block bg-electricGreen text-black font-black py-4 rounded-xl text-lg hover:bg-electricGreen-dark transition-all text-center uppercase tracking-wider"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div>
            <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <XCircle className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-black uppercase text-white mb-2">Verification Failed</h2>
            <p className="text-red-500 font-bold mb-6 text-sm leading-relaxed">
              {errorMessage}
            </p>
            
            <div className="border-t border-white/5 pt-6 mt-6">
              <h3 className="text-sm font-bold text-white uppercase mb-4">Request a New Link</h3>
              <form onSubmit={handleResend} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    required
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-xl py-3 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold text-sm text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={resending || cooldown > 0}
                  className="w-full bg-electricGreen text-black font-black py-3 rounded-xl text-sm hover:bg-electricGreen-dark transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {resending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>SENDING...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <span>RESEND IN {cooldown}S</span>
                  ) : (
                    <span>RESEND VERIFICATION LINK</span>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8">
              <Link to="/login" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default VerifyEmail
