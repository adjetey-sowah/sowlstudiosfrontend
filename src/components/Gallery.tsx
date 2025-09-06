import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const images = [
    {
      src: "/gallery/img_1234567.jpeg",
      category: "individual",
      quote: "Dreams take flight with golden confetti and endless possibilities",
      alt: "Graduation celebration with balloons and golden confetti"
    },
    {
      src: "/gallery/IMG_6093.jpg",
      category: "individual",
      quote: "Dreams take flight with golden confetti and endless possibilities",
      alt: "Graduation celebration with balloons and golden confetti"
    },
    {
      src: "/gallery/IMG_9070-Edit.jpg",
      category: "ceremony",
      quote: "Where dedication meets celebration",
      alt: "Graduation ceremony"
    },
    {
      src: "/gallery/IMG_6158.jpg",
      category: "individual",
      quote: "Dreams take flight with golden confetti and endless possibilities",
      alt: "Graduation celebration with balloons and golden confetti"
    },
    {
      src: "/gallery/img_223344.jpg",
      category: "candid",
      quote: "Surrounded by dreams, radiating confidence and grace",
      alt: "Elegant graduation portrait with pink and white balloons"
    },
    {
      src: "/gallery/IMG_6107.jpg",
      category: "individual",
      quote: "The future belongs to those who believe in the beauty of their dreams",
      alt: "Individual graduation portrait"
    },
    {
      src: "/gallery/IMG_6333.jpg",
      category: "group",
      quote: "Together we achieved the impossible",
      alt: "Group graduation photo"
    },
    {
      src: "/gallery/IMG_9222.jpg",
      category: "candid",
      quote: "Pure joy in a single moment",
      alt: "Candid graduation moment"
    },
    {
      src: "/gallery/IMG_9071-Edit.jpg",
      category: "ceremony",
      quote: "Where dedication meets celebration",
      alt: "Graduation ceremony"
    },
    {
      src: "/gallery/IMG_7626.jpg",
      category: "family",
      quote: "Success shared with those who matter most",
      alt: "Family graduation photo"
    },
    {
      src: "/gallery/IMG_6094.jpg",
      category: "family",
      quote: "Success shared with those who matter most",
      alt: "Family graduation photo"
    },
    {
      src: "/gallery/IMG_2146.jpg",
      category: "individual",
      quote: "Confidence earned through perseverance",
      alt: "Individual portrait"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'individual', name: 'Individual' },
    { id: 'group', name: 'Group Photos' },
    { id: 'family', name: 'Family' },
    { id: 'candid', name: 'Candid Moments' },
    { id: 'ceremony', name: 'Ceremony' }
  ];

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };
  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = selectedImage;
    const totalImages = filteredImages.length;
    
    if (direction === 'prev') {
      setSelectedImage(currentIndex > 0 ? currentIndex - 1 : totalImages - 1);
    } else {
      setSelectedImage(currentIndex < totalImages - 1 ? currentIndex + 1 : 0);
    }
  };

  return (
    <section id="gallery" ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center space-y-6 mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-gray-900">
            Our Gallery of
            <span className="block font-bold text-amber-600">Graduation Moments</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Each photograph tells a unique story of achievement, growth, and the bright future ahead. 
            Explore our collection of graduation photography that captures the essence of this milestone moment.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-500 transform hover:scale-105 ${
                filter === category.id
                  ? 'bg-amber-600 text-white shadow-lg animate-pulse-subtle'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-rotate-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden">
                {!loadedImages.has(index) && (
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:brightness-110 ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <blockquote className="text-lg font-light italic leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                    "{image.quote}"
                  </blockquote>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-4 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-amber-400 transition-all duration-300 z-10 transform hover:scale-125 hover:rotate-90"
            >
              <X className="h-8 w-8" />
            </button>

            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 transition-all duration-300 z-10 transform hover:scale-125"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 transition-all duration-300 z-10 transform hover:scale-125"
            >
              <ChevronRight className="h-12 w-12" />
            </button>

            <div className="max-w-4xl max-h-full animate-scale-in">
              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                className="max-w-full max-h-full object-contain"
              />
              
              <div className="text-center mt-6 text-white animate-slide-up-delay-1">
                <blockquote className="text-xl italic">
                  "{filteredImages[selectedImage].quote}"
                </blockquote>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;