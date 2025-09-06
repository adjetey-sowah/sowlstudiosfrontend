import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, Camera, Heart } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Award className="h-8 w-8 text-amber-600" />,
      title: "10+ Years Experience",
      description: "A decade of capturing precious graduation moments with artistic excellence"
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" />,
      title: "5000+ Happy Graduates",
      description: "Trusted by thousands of families to preserve their milestone achievements"
    },
    {
      icon: <Camera className="h-8 w-8 text-amber-600" />,
      title: "Professional Equipment",
      description: "State-of-the-art cameras and lighting for flawless image quality"
    },
    {
      icon: <Heart className="h-8 w-8 text-amber-600" />,
      title: "Personal Touch",
      description: "Every session is tailored to reflect your unique personality and story"
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-serif font-light text-gray-900">
                Capturing Your
                <span className="block font-bold text-amber-600">Academic Journey</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                At Sowl Studios, we understand that graduation represents more than just an academic achievement—it's the culmination of years of dedication, growth, and dreams realized. Our specialized approach to graduation photography ensures every precious moment is preserved with artistic excellence.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                From intimate individual portraits that capture your unique personality to dynamic group shots that celebrate shared accomplishments, we create timeless images that you'll treasure for a lifetime.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`group transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="space-y-3">
                    <div className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-700">
              <img
                src="https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop"
                alt="Behind the scenes at Sowl Studios"
                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/40 transition-all duration-500"></div>
            </div>
            
            {/* Floating Quote Card */}
            <div className={`absolute -bottom-8 -left-8 bg-white rounded-lg shadow-xl p-6 max-w-sm transform hover:scale-105 transition-all duration-500 ${
              isVisible ? 'animate-slide-up-float' : ''
            }`}>
              <blockquote className="text-gray-700 italic">
                "Every graduation photo should tell the story of perseverance, achievement, and the bright future ahead."
              </blockquote>
              <cite className="block mt-3 text-sm font-semibold text-amber-600">- Sowl Studios Philosophy</cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;