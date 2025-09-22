import { Camera, Phone, Mail, Clock, Facebook, Instagram, Twitter, Globe } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-amber-400" />
              <span className="text-2xl font-serif font-bold">Sowl Studios</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Capturing graduation memories with artistic excellence and professional care. 
              Your milestone moments deserve nothing less than perfection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com/sowlstudios" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-amber-400 transition-colors" title="Sowl Studios">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <nav className="space-y-3">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'About Us', id: 'about' },
                { name: 'Our Gallery', id: 'gallery' },
                { name: 'Meet the Team', id: 'team' },
                { name: 'Testimonials', id: 'testimonials' },
                { name: 'Book Now', id: 'booking' }
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Individual Portraits</li>
              <li>Family Sessions</li>
              <li>Group Photography</li>
              <li>Ceremony Coverage</li>
              <li>Professional Editing</li>
              <li>Digital Gallery Access</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-4">
              {/* Phone Numbers */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-amber-400" />
                  <div className="text-gray-300">
                    <p className="font-medium">Julius: 0543358413</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-8">
                  <span className="text-gray-300">Joel: +233 57 949 9223</span>
                </div>
                <div className="flex items-center space-x-3 ml-8">
                  <span className="text-gray-300">Abena: 0557009665</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400" />
                <a href="mailto:support@sowlstudios.xyz" className="text-gray-300 hover:text-amber-400 transition-colors">
                  support@sowlstudios.xyz
                </a>
              </div>

              {/* Website */}
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-amber-400" />
                <a href="https://www.sowlstudios.xyz" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-amber-400 transition-colors">
                  www.sowlstudios.xyz
                </a>
              </div>
      
              {/* Business Hours */}
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-amber-400 mt-1" />
                <div className="text-gray-300">
                  <p>Mon-Fri: 9AM - 7PM</p>
                  <p>Sat-Sun: 10AM - 5PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © 2024 Sowl Studios. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-amber-600 text-center py-3">
        <p className="text-white text-sm font-medium">
          Need urgent assistance? Call our 24/7 emergency line: (555) 999-GRAD
        </p>
      </div>
    </footer>
  );
};

export default Footer;