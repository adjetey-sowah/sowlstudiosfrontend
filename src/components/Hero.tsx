import React, { useState, useEffect } from 'react';
import { ChevronDown, Play } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const heroImages = [
    {
      src: "/gallery/IMG_6093.jpg",
      alt: "Graduation ceremony celebration"
    },
    {
      src: "/gallery/IMG_6107.jpg",
      alt: "Graduate throwing cap in celebration"
    },
    {
      // src: "/gallery/IMG_6158.jpg",
      alt: "Individual graduation portrait"
    },
    {
      src: "/gallery/IMG_6333.jpg",
      alt: "Group graduation photo"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover scale-105 animate-ken-burns"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className={`space-y-12 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400/30 to-primary-600/30 rounded-lg blur-xl"></div>
            <h1 className="relative text-5xl sm:text-6xl lg:text-8xl font-serif leading-tight tracking-tight">
              <span className="block font-light animate-slide-up-delay-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Freeze Moments</span>
              <span className="block font-light animate-slide-up-delay-2 text-3xl sm:text-4xl lg:text-5xl mt-4 text-white/90">with</span>
              <span className="block font-bold text-transparent bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text animate-slide-up-delay-3 transform hover:scale-105 transition-transform duration-500 mt-2">
                Sowl Studios
              </span>
            </h1>
          </div>
          
          <p className={`text-xl sm:text-2xl font-light leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="bg-gradient-to-r from-white/95 to-white/75 bg-clip-text text-transparent">
              Capturing the essence of your graduation journey with timeless elegance and artistic excellence. 
              Every milestone deserves to be preserved beautifully.
            </span>
          </p>

          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center pt-12 transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button
              onClick={() => scrollToSection('booking')}
              className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-medium transition-all bg-primary-500 rounded-full hover:bg-primary-600 text-xl text-white duration-500 transform hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-primary-400 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative group-hover:animate-bounce">Book Your Slot</span>
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-medium text-white transition-all duration-500 ease-in-out border-2 border-white/30 rounded-full hover:border-white group hover:scale-105 backdrop-blur-sm"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 -translate-x-full bg-white/10 group-hover:translate-x-0 ease">
                <span className="mr-2">View Our Works</span>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-500 transform group-hover:translate-x-full ease">View Our Works</span>
              <span className="relative invisible">View Our Works</span>
            </button>
          </div>

          <div className={`pt-16 transition-all duration-1000 delay-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white/80 hover:text-white transition-all duration-300 animate-bounce-slow group"
            >
              <ChevronDown className="h-8 w-8 mx-auto group-hover:scale-125 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className={`absolute bottom-8 right-8 hidden lg:block transition-all duration-1000 delay-1200 ${
        isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-black/20 backdrop-blur-md rounded-xl p-6 text-white border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
            <p className="text-sm font-light text-primary-200">Professional Photography</p>
            <p className="text-lg font-semibold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">Since 2015</p>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.3})`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 25}s`
            }}
          />
        ))}
      </div>

      {/* Side Decorative Elements */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-32 hidden lg:block">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-primary-500/30 to-transparent"></div>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-32 hidden lg:block">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-primary-500/30 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;