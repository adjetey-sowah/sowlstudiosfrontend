import React, { useState, useEffect } from 'react';
import { Menu, X, Camera } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-700 ease-in-out ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <Camera className={`h-8 w-8 transition-colors duration-500 ${
              isScrolled ? 'text-amber-600' : 'text-white'
            }`} />
            <span className={`text-2xl font-serif font-bold transition-colors duration-500 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>Sowl Studios</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { name: 'Home', id: 'hero' },
              { name: 'About', id: 'about' },
              { name: 'Gallery', id: 'gallery' },
              { name: 'Team', id: 'team' },
              { name: 'Testimonials', id: 'testimonials' },
              { name: 'Contact', id: 'booking' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-all duration-500 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-amber-600' 
                    : 'text-white/90 hover:text-amber-400'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => scrollToSection('booking-form')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-500 transform hover:scale-105 ${
                isScrolled
                  ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg'
                  : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-gray-900'
              }`}
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 transition-colors duration-500 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`} />
            ) : (
              <Menu className={`h-6 w-6 transition-colors duration-500 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t animate-slide-down">
            <nav className="px-4 py-6 space-y-4">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'About', id: 'about' },
                { name: 'Gallery', id: 'gallery' },
                { name: 'Team', id: 'team' },
                { name: 'Testimonials', id: 'testimonials' },
                { name: 'Contact', id: 'booking' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-gray-700 hover:text-amber-600 transition-colors font-medium py-2"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('booking-form')}
                className="w-full bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition-colors font-medium mt-4"
              >
                Book Now
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;