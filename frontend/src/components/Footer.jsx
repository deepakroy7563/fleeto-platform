import { Zap, Facebook, Twitter, Instagram, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-darkBg-lighter border-t border-white border-opacity-5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Zap className="h-8 w-8 text-electricGreen" />
              <span className="text-2xl font-bold tracking-tighter">FLEETO</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Pioneering the future of electric mobility with high-performance bikes and a sustainable ecosystem.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/bikes" className="hover:text-electricGreen transition-colors">Electric Bikes</Link></li>
              <li><Link to="/parts" className="hover:text-electricGreen transition-colors">Spare Parts</Link></li>
              <li><Link to="/find-dealer" className="hover:text-electricGreen transition-colors">Find a Dealer</Link></li>
              <li><Link to="/login" className="hover:text-electricGreen transition-colors">Dealer Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/contact" className="hover:text-electricGreen transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="hover:text-electricGreen transition-colors">Service Request</Link></li>
              <li><Link to="/register" className="hover:text-electricGreen transition-colors">Partner With Us</Link></li>
              <li><Link to="/" className="hover:text-electricGreen transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-3 rounded-full bg-darkBg border border-white border-opacity-5 hover:border-electricGreen transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 rounded-full bg-darkBg border border-white border-opacity-5 hover:border-electricGreen transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 rounded-full bg-darkBg border border-white border-opacity-5 hover:border-electricGreen transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 rounded-full bg-darkBg border border-white border-opacity-5 hover:border-electricGreen transition-all">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white border-opacity-5 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Fleeto Electric Mobility. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
