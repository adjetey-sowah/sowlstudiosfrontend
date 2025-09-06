import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Jennifer Martinez",
      graduation: "Stanford University, Class of 2023",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      rating: 5,
      text: "Sowl Studios captured not just my graduation photos, but the entire emotion of the day. The team was professional, creative, and made me feel completely comfortable. The final photos exceeded all my expectations and perfectly represent this milestone moment in my life."
    },
    {
      name: "Michael Thompson",
      graduation: "Harvard Business School, MBA 2023",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      rating: 5,
      text: "From the initial consultation to the final delivery, Sowl Studios demonstrated exceptional professionalism and artistic vision. They understood exactly what I wanted and delivered photos that tell the story of my academic journey beautifully. Highly recommend for any graduate!"
    },
    {
      name: "Sophia Chen",
      graduation: "MIT, Computer Science 2023",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      rating: 5,
      text: "The attention to detail and artistic approach at Sowl Studios is unmatched. They captured both formal portraits and candid moments that perfectly represent my personality and achievement. The photos are treasures I'll keep forever."
    },
    {
      name: "David Williams",
      graduation: "UCLA, Medical School 2023",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      rating: 5,
      text: "As a family, we were so impressed with how Sowl Studios made everyone feel comfortable and included. The family photos alongside my individual shots created a complete story of this important milestone. Professional, talented, and genuinely caring team."
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array(rating).fill(0).map((_, i) => (
      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
    ));
  };

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-gray-900">
            What Our
            <span className="block font-bold text-amber-600">Graduates Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from the graduates and families 
            who trusted us to capture their most important academic milestone.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-amber-600/20">
              <Quote className="h-16 w-16" />
            </div>

            <div className="relative z-10">
              {/* Rating */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-lg">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-amber-600 font-medium">
                    {testimonials[currentIndex].graduation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-amber-600"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-amber-600"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-amber-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">98%</div>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">500+</div>
            <p className="text-gray-600">5-Star Reviews</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">48hr</div>
            <p className="text-gray-600">Quick Turnaround</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">100%</div>
            <p className="text-gray-600">Memory Guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;