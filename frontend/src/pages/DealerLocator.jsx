import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import api from '../services/api'
import { MapPin, Phone, Shield, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import L from 'leaflet'

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const center = {
  lat: 28.6139, // New Delhi default
  lng: 77.2090
};

// Component to handle map center changes
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
};

const DealerLocator = () => {
  const [dealers, setDealers] = useState([])
  const [selectedDealer, setSelectedDealer] = useState(null)
  const [mapCenter, setMapCenter] = useState(center)

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await api.get('/users/dealers')
        const filteredDealers = response.data.data.filter(d => d.location && d.location.coordinates)
        setDealers(filteredDealers)
        
        if (filteredDealers.length > 0) {
          setMapCenter({
            lat: filteredDealers[0].location.coordinates[1],
            lng: filteredDealers[0].location.coordinates[0]
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchDealers()
  }, [])

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Find a <span className="text-electricGreen">Dealer</span></h1>
        <p className="text-gray-500 font-bold max-w-2xl mx-auto">Locate authorized Fleeto experience centers near you and book a test ride today. <span className="text-electricGreen">(Powered by OpenStreetMap)</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Dealer List */}
        <div className="lg:col-span-1 space-y-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {dealers.map((dealer) => (
            <motion.div
              key={dealer._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedDealer(dealer)
                setMapCenter({
                  lat: dealer.location.coordinates[1],
                  lng: dealer.location.coordinates[0]
                })
              }}
              className={`glass-panel p-6 rounded-2xl border cursor-pointer transition-all ${selectedDealer?._id === dealer._id ? 'border-electricGreen bg-electricGreen/5' : 'border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-5 w-5 text-electricGreen" />
                <h3 className="font-black uppercase text-sm tracking-tight">{dealer.agencyName}</h3>
              </div>
              <p className="text-xs text-gray-400 font-bold mb-4 flex items-start">
                <MapPin className="h-3 w-3 mr-2 mt-0.5 shrink-0" />
                {dealer.location.address}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center">
                  <Phone className="h-3 w-3 mr-1" /> {dealer.phone}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const lat = dealer.location.coordinates[1];
                    const lng = dealer.location.coordinates[0];
                    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-electricGreen hover:underline"
                >
                  Get Directions
                </button>
              </div>
            </motion.div>
          ))}
          {dealers.length === 0 && (
             <div className="text-center py-20 text-gray-500 font-bold">
               No dealers found in your area.
             </div>
          )}
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 relative">
          <div className="glass-panel p-2 rounded-[2.5rem] border border-white/5 h-full min-h-[500px] overflow-hidden">
            <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={12} style={{ height: '600px', width: '100%', borderRadius: '2rem' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <RecenterMap center={mapCenter} />
              {dealers.map((dealer) => (
                <Marker 
                  key={dealer._id} 
                  position={[dealer.location.coordinates[1], dealer.location.coordinates[0]]}
                  eventHandlers={{
                    click: () => setSelectedDealer(dealer),
                  }}
                >
                  <Popup>
                    <div className="p-1 text-black">
                      <h4 className="font-black uppercase text-xs mb-1">{dealer.agencyName}</h4>
                      <p className="text-[10px] font-bold">{dealer.location.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <button 
            className="absolute bottom-10 left-10 bg-electricGreen text-black font-black px-6 py-4 rounded-xl text-xs flex items-center space-x-3 shadow-2xl hover:scale-105 transition-all z-[1000]"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                   setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                })
              }
            }}
          >
            <Navigation className="h-4 w-4" />
            <span>Find Dealers Near Me</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const darkMapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1a1a1a" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#222222" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#333333" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f1f1f" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
]

export default DealerLocator
