import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Zap, Shield, Battery, Gauge, Star, Users, MapPin, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

const Home = () => {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const stats = [
    { label: 'Happy Customers', value: '10K+', icon: <Users className="h-6 w-6" /> },
    { label: 'Bikes Sold', value: '15K+', icon: <Zap className="h-6 w-6" /> },
    { label: 'Agencies', value: '50+', icon: <MapPin className="h-6 w-6" /> },
    { label: 'Countries', value: '12+', icon: <Shield className="h-6 w-6" /> },
  ]

  const featuredBikes = [
    { id: 1, name: 'Fleeto Pro X', price: '₹1,50,000', range: '120km', speed: '85km/h', color: 'bg-electricGreen' },
    { id: 2, name: 'Urban Glide', price: '₹95,000', range: '80km', speed: '45km/h', color: 'bg-blue-500' },
    { id: 3, name: 'Sport Cruiser', price: '₹2,20,000', range: '150km', speed: '110km/h', color: 'bg-red-500' },
  ]

  const spareParts = [
    { id: 1, name: 'Smart Battery 5.0', price: '₹45,000', category: 'Battery' },
    { id: 2, name: 'Electric Motor 250W', price: '₹25,000', category: 'Motor' },
    { id: 3, name: 'Anti-Theft Lock', price: '₹4,500', category: 'Security' },
  ]

  const testimonials = [
    { name: 'Alex Johnson', text: 'The Fleeto Pro X is the best electric bike I have ever owned. The range is incredible!', role: 'Daily Commuter' },
    { name: 'Sarah Williams', text: 'I love the design and the electric green accents. It definitely turns heads in the city.', role: 'Fitness Enthusiast' },
  ]

  return (
    <div className="bg-darkBg text-white overflow-x-hidden">
      {/* Hero Section */}
      <section ref={targetRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Placeholder for Video Background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-darkBg z-10"></div>
          {/* Using a high-end gradient as a placeholder for video */}
          <div className="absolute inset-0 opacity-40">
             <div className="absolute top-0 -left-1/4 w-[100%] h-[100%] bg-electricGreen/20 blur-[150px] rounded-full"></div>
             <div className="absolute bottom-0 -right-1/4 w-[80%] h-[80%] bg-blue-600/10 blur-[150px] rounded-full"></div>
          </div>
        </div>

        <motion.div 
          style={{ opacity, scale }}
          className="relative z-20 text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1 rounded-full border border-electricGreen text-electricGreen text-sm font-bold mb-6 tracking-widest uppercase">
              The Future of Mobility
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
              LIMITLESS <br /> <span className="text-electricGreen">ENERGY.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
              Experience the pinnacle of electric performance. Engineered for the bold, designed for the future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/bikes" className="group bg-electricGreen text-black px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 flex items-center space-x-2">
                <span>ORDER NOW</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="px-10 py-5 rounded-full font-bold text-lg border border-white border-opacity-20 hover:bg-white hover:text-black transition-all">
                LEARN MORE
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-gray-500"
        >
          <div className="w-[2px] h-12 bg-gradient-to-b from-electricGreen to-transparent mx-auto"></div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-30 -mt-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center justify-center"
            >
              <div className="text-electricGreen mb-4">{stat.icon}</div>
              <div className="text-4xl font-black mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">OUR FLEET.</h2>
              <div className="w-20 h-1 bg-electricGreen"></div>
            </div>
            <Link to="/bikes" className="text-electricGreen font-bold flex items-center space-x-2 mt-4 md:mt-0 hover:underline">
              <span>View All Models</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredBikes.map((bike, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative rounded-3xl overflow-hidden bg-darkBg-lighter border border-white border-opacity-5"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center p-8">
                  <Zap className={`h-24 w-24 text-white opacity-20 group-hover:scale-110 group-hover:text-electricGreen transition-all duration-500`} />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{bike.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                    <span className="flex items-center"><Battery className="h-4 w-4 mr-1" /> {bike.range}</span>
                    <span className="flex items-center"><Gauge className="h-4 w-4 mr-1" /> {bike.speed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black">{bike.price}</span>
                    <Link to={`/bikes/${bike.id}`} className="p-3 rounded-full bg-electricGreen text-black hover:scale-110 transition-transform">
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 px-4 bg-darkBg-lighter relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">PERFORMANCE <br /> MEETS <span className="text-electricGreen">SAFETY.</span></h2>
            <div className="space-y-8">
              {[
                { title: 'Zero Emissions', desc: 'Contribute to a greener planet with our carbon-neutral transport solutions.' },
                { title: 'Smart Connectivity', desc: 'Real-time GPS tracking and mobile app integration for all Fleeto models.' },
                { title: 'Nationwide Service', desc: 'Access over 50 service centers and verified agencies across the country.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="mt-1 p-1 rounded-full bg-electricGreen/10 text-electricGreen">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-electricGreen/20 to-blue-600/10 rounded-full absolute -inset-10 blur-[100px] opacity-30"></div>
            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white border-opacity-10 glass-panel p-2">
              <div className="bg-darkBg rounded-[2.8rem] aspect-square flex items-center justify-center overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=800" alt="E-Bike Tech" className="w-full h-full object-cover opacity-60" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spare Parts Grid */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">PREMIUM SPARES.</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Original parts designed to keep your Fleeto running at peak performance.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {spareParts.map((part, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-8 rounded-3xl flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-electricGreen uppercase tracking-widest mb-4 block">{part.category}</span>
                <h3 className="text-2xl font-bold mb-6">{part.name}</h3>
              </div>
              <div className="flex items-center justify-between mt-8 border-t border-white border-opacity-5 pt-6">
                <span className="text-xl font-bold">{part.price}</span>
                <button className="text-electricGreen font-bold flex items-center space-x-1 hover:translate-x-1 transition-transform">
                  <span>Add to Cart</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 bg-darkBg-lighter">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-black mb-6">VOICES OF <br /><span className="text-electricGreen">THE FUTURE.</span></h2>
              <div className="flex space-x-1 text-electricGreen mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
              </div>
              <p className="text-gray-400">Trusted by over 10,000 riders worldwide.</p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-darkBg p-10 rounded-[2.5rem] border border-white border-opacity-5 relative"
                >
                  <p className="text-xl italic text-gray-300 mb-8 leading-relaxed">"{t.text}"</p>
                  <div>
                    <h5 className="font-bold text-lg">{t.name}</h5>
                    <span className="text-gray-500 text-sm">{t.role}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto glass-panel p-16 rounded-[4rem] text-center relative z-10 border-electricGreen/20">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">READY TO GO <span className="text-electricGreen">ELECTRIC?</span></h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join the movement and redefine your daily commute. Book a test ride today at your nearest dealer.</p>
          <Link to="/bikes" className="inline-flex items-center space-x-3 bg-white text-black px-12 py-6 rounded-full font-black text-xl hover:bg-electricGreen transition-colors group">
            <span>GET STARTED</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-electricGreen/5 blur-[120px] rounded-full -z-10"></div>
      </section>
    </div>
  )
}

export default Home
