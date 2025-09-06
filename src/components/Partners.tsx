import React from 'react';

const Partners = () => {
  const partners = [
    {
      name: "Kwame Nkrumah University of Science and Technology",
      shortName: "KNUST",
      logo: "https://i.pinimg.com/736x/40/66/a6/4066a6361f5ba8f158a892ba1b15f779.jpg"
    },
    {
      name: "University of Ghana",
      shortName: "UG-LEGON",
      logo: "/logos/ug-legon.svg"
    },
    {
      name: "University of Cape Coast",
      shortName: "UCC",
      logo: "https://ucc.edu.gh/sites/default/files/ucc-logo.webp"
    },
    {
      name: "University of Professional Studies, Accra",
      shortName: "UPSA",
      logo: "/logos/upsa.svg"
    },
    {
      name: "University of Education, Winneba",
      shortName: "UEW",
      logo: "/logos/uew.svg"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-gray-900">
            We're Coming to
            <span className="block font-bold text-amber-600">Your University</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sowl Studios is proud to serve Ghana's leading universities. We bring our professional graduation
            photography services directly to your campus, capturing your milestone moments with excellence.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center"
            >
              <div className="text-center space-y-4">
                <div className="relative overflow-hidden rounded-lg bg-white p-2">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="h-16 w-16 mx-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="h-16 w-16 mx-auto bg-amber-100 rounded-lg hidden items-center justify-center">
                    <span className="text-sm font-bold text-amber-600">
                      {partner.shortName}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600 mb-1">
                    {partner.shortName}
                  </p>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
                    {partner.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Benefits */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Campus Presence</h3>
              <p className="text-gray-600">
                We visit your campus during graduation season to provide convenient on-site services
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Iconic Locations</h3>
              <p className="text-gray-600">
                Professional photography at your university's most beautiful and iconic campus locations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">University Packages</h3>
              <p className="text-gray-600">
                Tailored graduation packages that celebrate each university's unique traditions and heritage
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;