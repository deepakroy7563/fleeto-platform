import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBikes } from '../features/bikes/bikeSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Battery, Gauge, Zap, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const Bikes = () => {
  const dispatch = useDispatch()
  const { bikes, loading, error, total, pagination } = useSelector((state) => state.bikes)
  
  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState(1000000)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 6,
      category: category !== 'All' ? category : undefined,
      search: searchTerm || undefined,
      'price[lte]': priceRange
    }
    dispatch(fetchBikes(params))
  }, [dispatch, category, searchTerm, priceRange, currentPage])

  const categories = ['All', 'City', 'Sport', 'Cruiser', 'Off-Road']

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-7xl font-black mb-4 uppercase tracking-tighter leading-none">OUR FLEET.</h1>
            <p className="text-gray-400 max-w-xl font-medium">Discover the peak of electric engineering. Filter through our models to find your perfect ride.</p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
             <div className="text-right hidden md:block">
               <div className="text-2xl font-black">{total}</div>
               <div className="text-xs text-gray-500 uppercase font-black tracking-widest">Models Available</div>
             </div>
             <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`p-4 rounded-2xl border transition-all ${showFilters ? 'bg-electricGreen border-electricGreen text-black' : 'border-white border-opacity-10 text-white hover:border-white'}`}
             >
               <Filter className="h-6 w-6" />
             </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="glass-panel p-8 rounded-[2.5rem] border border-white border-opacity-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {/* Search */}
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-4 tracking-widest">Search Models</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="e.g. Pro X"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-darkBg border border-white border-opacity-10 rounded-xl py-4 pl-12 pr-4 focus:border-electricGreen outline-none transition-all font-bold"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-4 tracking-widest">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                            category === cat ? 'bg-electricGreen text-black' : 'bg-darkBg border border-white border-opacity-10 text-gray-400'
                          }`}
                        >
                          {cat.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-4 tracking-widest flex justify-between">
                      <span>Max Price</span>
                      <span className="text-electricGreen">₹{priceRange.toLocaleString()}</span>
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="5000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full accent-electricGreen"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 font-black mt-2">
                      <span>₹10,000</span>
                      <span>₹1,000,000</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white border-opacity-5 flex justify-end">
                   <button 
                    onClick={() => {
                      setSearchTerm('')
                      setCategory('All')
                      setPriceRange(1000000)
                    }}
                    className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest flex items-center space-x-2"
                   >
                     <X className="h-4 w-4" />
                     <span>Reset Filters</span>
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bike Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-darkBg-lighter rounded-[2.5rem] h-96"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-32">
            <Zap className="h-16 w-16 text-gray-800 mx-auto mb-6" />
            <div className="text-2xl font-black text-gray-500">No matching models found.</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {bikes.map((bike, idx) => (
                <motion.div
                  key={bike._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative glass-panel rounded-[2.5rem] overflow-hidden border border-white border-opacity-5"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center p-12 relative">
                    {bike.images?.[0] ? (
                      <img src={bike.images[0].url} alt={bike.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <Zap className="h-24 w-24 text-white opacity-10" />
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="bg-electricGreen text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">{bike.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-10">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-black tracking-tight">{bike.name}</h3>
                      <span className="text-xl font-black text-electricGreen">₹{bike.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-6 mb-10">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Battery className="h-4 w-4 text-electricGreen" />
                        <span className="text-xs font-bold">{bike.specifications.range}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Gauge className="h-4 w-4 text-electricGreen" />
                        <span className="text-xs font-bold">{bike.specifications.topSpeed}</span>
                      </div>
                    </div>

                    <Link 
                      to={`/bikes/${bike._id}`} 
                      className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center space-x-3 hover:bg-electricGreen transition-all group"
                    >
                      <span className="text-sm">EXPLORE MODEL</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex items-center justify-center space-x-6">
              <button 
                disabled={!pagination.prev}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-4 rounded-xl border border-white border-opacity-10 text-white disabled:opacity-20 hover:bg-white hover:text-black transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-2">
                {[...Array(Math.ceil((total || 0) / 6))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-xl font-black transition-all ${
                      currentPage === i + 1 ? 'bg-electricGreen text-black' : 'border border-white border-opacity-10 text-gray-500 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={!pagination.next}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-4 rounded-xl border border-white border-opacity-10 text-white disabled:opacity-20 hover:bg-white hover:text-black transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Bikes
