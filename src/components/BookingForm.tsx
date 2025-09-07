import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Calendar, MapPin, Users, Camera } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  schoolUniversity: string;
  graduationDate: string;
  packagePreference: string;
  preferredLocation: string;
  additionalRequests: string;
}

const BookingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    schoolUniversity: '',
    graduationDate: '',
    packagePreference: '',
    preferredLocation: '',
    additionalRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiBaseUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          schoolUniversity: '',
          graduationDate: '',
          packagePreference: '',
          preferredLocation: '',
          additionalRequests: ''
        });
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to submit your booking. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-gray-900">
            Book Your
            <span className="block font-bold text-amber-600">Graduation Session</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to capture your graduation memories? Fill out the form below and we'll get back to you 
            within 24 hours to discuss your photography needs and schedule your session.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <Calendar className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Quick Response</h3>
            <p className="text-gray-600 text-sm">We respond within 24 hours</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Flexible Locations</h3>
            <p className="text-gray-600 text-sm">On-campus or studio sessions</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <Camera className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600 text-sm">Professional equipment & editing</p>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Graduation Details */}
            <div className="space-y-6">
              <div>
                <label htmlFor="schoolUniversity" className="block text-sm font-semibold text-gray-700 mb-2">
                  School/University *
                </label>
                <select
                  id="schoolUniversity"
                  name="schoolUniversity"
                  value={formData.schoolUniversity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                >
                  <option value="">Select your university</option>
                  <option value="University of Ghana">University of Ghana (UG)</option>
                  <option value="Kwame Nkrumah University of Science and Technology">Kwame Nkrumah University of Science and Technology (KNUST)</option>
                  <option value="University of Cape Coast">University of Cape Coast (UCC)</option>
                  <option value="University of Education Winneba">University of Education, Winneba (UEW)</option>
                  <option value="University for Development Studies">University for Development Studies (UDS)</option>
                  <option value="Ghana Institute of Management and Public Administration">Ghana Institute of Management and Public Administration (GIMPA)</option>
                  <option value="University of Professional Studies Accra">University of Professional Studies, Accra (UPSA)</option>
                  <option value="University of Mines and Technology">University of Mines and Technology (UMaT)</option>
                  <option value="University of Health and Allied Sciences">University of Health and Allied Sciences (UHAS)</option>
                  <option value="University of Energy and Natural Resources">University of Energy and Natural Resources (UENR)</option>
                  <option value="Ghana Communication Technology University">Ghana Communication Technology University (GCTU)</option>
                  <option value="Accra Technical University">Accra Technical University (ATU)</option>
                  <option value="Kumasi Technical University">Kumasi Technical University (KsTU)</option>
                  <option value="Cape Coast Technical University">Cape Coast Technical University (CCTU)</option>
                  <option value="Ho Technical University">Ho Technical University (HTU)</option>
                  <option value="Takoradi Technical University">Takoradi Technical University (TTU)</option>
                  <option value="Sunyani Technical University">Sunyani Technical University (STU)</option>
                  <option value="Tamale Technical University">Tamale Technical University (TaTU)</option>
                  <option value="Koforidua Technical University">Koforidua Technical University (KTU)</option>
                  <option value="Bolgatanga Technical University">Bolgatanga Technical University (BTU)</option>
                  <option value="Wa Technical University">Wa Technical University (WTU)</option>
                  <option value="Central University">Central University</option>
                  <option value="Valley View University">Valley View University</option>
                  <option value="Methodist University College Ghana">Methodist University College Ghana</option>
                  <option value="Catholic University College of Ghana">Catholic University College of Ghana</option>
                  <option value="Presbyterian University College">Presbyterian University College Ghana</option>
                  <option value="Ashesi University">Ashesi University</option>
                  <option value="Lancaster University Ghana">Lancaster University Ghana</option>
                  <option value="Academic City University College">Academic City University College</option>
                  <option value="Ghana Baptist University College">Ghana Baptist University College</option>
                  <option value="Wisconsin International University College">Wisconsin International University College</option>
                  <option value="Webster University Ghana">Webster University Ghana</option>
                  <option value="Islamic University College">Islamic University College, Ghana</option>
                  <option value="Regional Maritime University">Regional Maritime University</option>
                  <option value="Ghana Institute of Journalism">Ghana Institute of Journalism (GIJ)</option>
                  <option value="Ghana Institute of Languages">Ghana Institute of Languages (GIL)</option>
                  <option value="Ghana Christian University College">Ghana Christian University College</option>
                  <option value="Pentecost University">Pentecost University</option>
                  <option value="All Nations University">All Nations University</option>
                  <option value="Garden City University College">Garden City University College</option>
                </select>
              </div>

              <div>
                <label htmlFor="graduationDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Graduation Date *
                </label>
                <input
                  type="date"
                  id="graduationDate"
                  name="graduationDate"
                  value={formData.graduationDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="packagePreference" className="block text-sm font-semibold text-gray-700 mb-2">
                  Package Preference *
                </label>
                <select
                  id="packagePreference"
                  name="packagePreference"
                  value={formData.packagePreference}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                >
                  <option value="">Select package</option>
                  <option value="Basic Package">Basic Package</option>
                  <option value="Premium Package">Premium Package</option>
                  <option value="Deluxe Package">Deluxe Package</option>
                  <option value="Custom Package">Custom Package</option>
                </select>
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="preferredLocation" className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                id="preferredLocation"
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                placeholder="On-campus, studio, or specific location preference"
              />
            </div>

            <div>
              <label htmlFor="additionalRequests" className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Requests or Questions
              </label>
              <textarea
                id="additionalRequests"
                name="additionalRequests"
                value={formData.additionalRequests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors resize-none"
                placeholder="Tell us about any special requests, specific poses you'd like, or questions you have..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center text-green-800">
                <CheckCircle className="h-5 w-5 mr-2" />
                Thank you! We'll contact you within 24 hours to discuss your graduation photography session.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center text-red-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Book Your Session
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;