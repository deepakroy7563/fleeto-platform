import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const MapSection = ({ locations = [] }) => {
  return (
    <section className="py-24 px-4 bg-darkBg-lighter overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">FIND A <span className="text-electricGreen">DEALER.</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-medium">Locate your nearest Fleeto authorized service and sales center.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          {/* Location List */}
          <div className="lg:col-span-1 space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {locations.length > 0 ? locations.map((loc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-3xl border border-white border-opacity-5 hover:border-electricGreen transition-all cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-electricGreen bg-opacity-10 text-electricGreen rounded-2xl group-hover:bg-electricGreen group-hover:text-black transition-all">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase mb-2">{loc.agencyName || loc.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{loc.location?.address || 'Premium Fleeto Dealer'}</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                        <Phone className="h-3 w-3" />
                        <span>{loc.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Open: 9 AM - 8 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="glass-panel p-10 rounded-3xl text-center border border-dashed border-white/10">
                <p className="text-gray-500 font-bold italic">No dealers found in this area.</p>
              </div>
            )}
          </div>

          {/* Map Integration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 relative min-h-[500px] rounded-[3.5rem] overflow-hidden border border-white border-opacity-10"
          >
            {/* Fallback Premium Map Visual (using Iframe for demo) */}
            <iframe 
              title="Fleeto Locations"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562010214643!2d77.227282!3d28.613939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b71dbff282!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin&maptype=satellite&style=feature:all|element:labels|visibility:off&style=feature:all|element:geometry|color:0x212121&style=feature:road|element:geometry|color:0x484848"
              className="absolute inset-0 w-full h-full grayscale invert opacity-60 contrast-125"
              frameBorder="0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
            
            {/* Dark Overlay for branding */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-darkBg-lighter rounded-[3.5rem]"></div>
            
            {/* Map Overlay Button */}
            <div className="absolute bottom-10 left-10 z-10">
               <button className="bg-electricGreen text-black font-black px-8 py-4 rounded-full text-sm hover:scale-105 transition-transform flex items-center space-x-2">
                 <MapPin className="h-4 w-4" />
                 <span>GET DIRECTIONS</span>
               </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MapSection
