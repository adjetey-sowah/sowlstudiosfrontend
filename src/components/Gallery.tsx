import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [columns, setColumns] = useState(3);
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Handle responsive columns
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else if (width < 1280) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

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
      alt: "Graduation celebration with balloons and golden confetti",
      height: 320
    },
    {
      src: "/gallery/IMG_6093.jpg",
      category: "individual",
      quote: "Dreams take flight with golden confetti and endless possibilities",
      alt: "Graduation celebration with balloons and golden confetti",
      height: 280
    },
    {
      src: "/gallery/IMG_9070-Edit.jpg",
      category: "ceremony",
      quote: "Where dedication meets celebration",
      alt: "Graduation ceremony",
      height: 400
    },
    {
      src: "/gallery/IMG_6158.jpg",
      category: "individual",
      quote: "Dreams take flight with golden confetti and endless possibilities",
      alt: "Graduation celebration with balloons and golden confetti",
      height: 350
    },
    {
      src: "/gallery/img_223344.jpg",
      category: "candid",
      quote: "Surrounded by dreams, radiating confidence and grace",
      alt: "Elegant graduation portrait with pink and white balloons",
      height: 300
    },
    {
      src: "/gallery/IMG_6107.jpg",
      category: "individual",
      quote: "The future belongs to those who believe in the beauty of their dreams",
      alt: "Individual graduation portrait",
      height: 380
    },
    {
      src: "/gallery/IMG_6333.jpg",
      category: "group",
      quote: "Together we achieved the impossible",
      alt: "Group graduation photo",
      height: 260
    },
    {
      src: "/gallery/IMG_9222.jpg",
      category: "candid",
      quote: "Pure joy in a single moment",
      alt: "Candid graduation moment",
      height: 340
    },
    {
      src: "/gallery/IMG_9071-Edit.jpg",
      category: "ceremony",
      quote: "Where dedication meets celebration",
      alt: "Graduation ceremony",
      height: 420
    },
    {
      src: "/gallery/IMG_7626.jpg",
      category: "family",
      quote: "Success shared with those who matter most",
      alt: "Family graduation photo",
      height: 290
    },
    {
      src: "/gallery/IMG_6094.jpg",
      category: "family",
      quote: "Success shared with those who matter most",
      alt: "Family graduation photo",
      height: 360
    },
    {
      src: "/gallery/IMG_2146.jpg",
      category: "individual",
      quote: "Confidence earned through perseverance",
      alt: "Individual portrait",
      height: 310
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

  // Create masonry columns
  const createMasonryColumns = useCallback(() => {
    const columnArrays: typeof filteredImages[] = Array.from({ length: columns }, () => []);
    
    filteredImages.forEach((image, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(image);
    });
    
    return columnArrays;
  }, [filteredImages, columns]);

  const masonryColumns = createMasonryColumns();

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

        {/* Pinterest-style Masonry Gallery */}
        <div 
          ref={galleryRef}
          className="flex gap-4 sm:gap-6 lg:gap-8"
          style={{ alignItems: 'flex-start' }}
        >
          {masonryColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex-1 flex flex-col gap-4 sm:gap-6 lg:gap-8">
              {column.map((image, imageIndex) => {
                const globalIndex = filteredImages.findIndex(img => img.src === image.src);
                
                return (
                  <div
                    key={`${columnIndex}-${imageIndex}`}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-[1.02] hover:-rotate-1 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ 
                      transitionDelay: `${(columnIndex * column.length + imageIndex) * 100}ms`,
                      height: `${image.height}px`
                    }}
                    onClick={() => openLightbox(globalIndex)}
                  >
                    <div className="w-full h-full overflow-hidden">
                      {!loadedImages.has(globalIndex) && (
                        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={image.src}
                        alt={image.alt}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
                          loadedImages.has(globalIndex) ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleImageLoad(globalIndex)}
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                        <blockquote className="text-sm sm:text-lg font-light italic leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                          "{image.quote}"
                        </blockquote>
                      </div>
                    </div>
                    
                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-4 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    {/* Pinterest-style category badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {categories.find(cat => cat.id === image.category)?.name || image.category}
                    </div>
                  </div>
                );
              })}
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
