import React from 'react';
import { Camera, Award, Users } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      name: "Adjetey Sowah Julius",
      role: "Lead Photographer & Founder",
      image: "/gallery/julsbaby.jpg",
      bio: "For over 5 years, Juls has been capturing moments that matter most. With a sharp eye and a love for storytelling through the lens, Juls makes sure every shot feels as good as the memory itself.”",
      experience: "5+ Years",
      specialization: "Portrait & Ceremony Photography"
    },
    {
      name: "Joel Amena",
      role: "Senior Photographer",
      image: "/gallery/sirjoel.jpg",
      bio: "Joel has a knack for catching the real moments — the laughs, the energy, the squad vibes. His candid shots bring out every graduate’s personality, making each photo feel alive.",
      experience: "3+ Years",
      specialization: "Group & Candid Photography"
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      bio: "Emily oversees the creative process and post-production, ensuring every image meets our highest standards of excellence.",
      experience: "3+ Years",
      specialization: "Creative Direction & Editing"
    }
  ];

  return (
    <section id="team" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-gray-900">
            Meet Our
            <span className="block font-bold text-amber-600">Creative Team</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our passionate team of professional photographers and creative directors work together 
            to ensure your graduation memories are captured with artistic excellence and personal care.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-amber-600 font-medium">{member.role}</p>
                    </div>

                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Award className="h-4 w-4 mr-2 text-amber-600" />
                        <span>{member.experience}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Camera className="h-4 w-4 mr-2 text-amber-600" />
                        <span>{member.specialization}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="mb-4">
              <Camera className="h-12 w-12 text-amber-600 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">10+</h3>
            <p className="text-gray-600">Years Combined Experience</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="mb-4">
              <Users className="h-12 w-12 text-amber-600 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">100+</h3>
            <p className="text-gray-600">Graduates Photographed</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="mb-4">
              <Award className="h-12 w-12 text-amber-600 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">3+</h3>
            <p className="text-gray-600">Awards & Recognition</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;