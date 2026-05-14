import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ShoppingBag, ArrowRight, Zap } from 'lucide-react'
import api from '../services/api'

const SpareParts = () => {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await api.get('/parts')
        setParts(res.data.data)
      } catch (err) {
        console.error('Failed to fetch parts', err)
      } finally {
        setLoading(false)
      }
    }
    fetchParts()
  }, [])

  const filteredParts = parts.filter(part => 
    part.partName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">SPARE PARTS.</h1>
          <p className="text-gray-400 max-w-2xl">Maintain your Fleeto with genuine original parts. Guaranteed performance and longevity.</p>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search parts (e.g. Battery, Motor, Tires)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-darkBg-lighter border border-white border-opacity-10 rounded-full py-4 pl-12 pr-6 focus:border-electricGreen outline-none transition-all"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="animate-pulse bg-darkBg-lighter rounded-3xl h-64"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredParts.map((part, idx) => (
              <motion.div
                key={part._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-8 rounded-3xl flex flex-col justify-between border border-white border-opacity-5 hover:border-electricGreen/30 transition-all"
              >
                <div>
                  <div className="aspect-square bg-darkBg rounded-2xl mb-6 flex items-center justify-center p-6 border border-white border-opacity-5">
                     {part.images?.[0] ? (
                       <img src={part.images[0].url} alt={part.partName} className="w-full h-full object-contain" />
                     ) : (
                       <ShoppingBag className="h-12 w-12 text-gray-700" />
                     )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{part.partName}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{part.description}</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white border-opacity-5">
                  <span className="text-2xl font-black text-electricGreen">₹{part.price}</span>
                  <button className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-xl font-black text-xs hover:bg-electricGreen transition-colors">
                    <span>ADD TO CART</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SpareParts
