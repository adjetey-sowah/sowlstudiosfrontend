import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Calendar, MapPin, Users, Camera } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  schoolUniversity: string;
  faculty: string;
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
    schoolUniversity: 'University of Professional Studies Accra',
    faculty: '',
    graduationDate: '',
    packagePreference: '',
    preferredLocation: '',
    additionalRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // UPSA Faculty graduation dates
  const upsaFaculties = {
    'Faculty of IT & Communication Studies': '2025-09-26',
    'Faculty of Accounting & Finance': '2025-09-29',
    'Faculty of Management Studies': '2025-10-01',
    'School of Graduate Studies': '2025-10-03'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'schoolUniversity' && value !== 'University of Professional Studies Accra') {
      // Reset faculty and graduation date if switching away from UPSA
      setFormData(prev => ({ ...prev, [name]: value, faculty: '', graduationDate: '' }));
    } else if (name === 'faculty' && formData.schoolUniversity === 'University of Professional Studies Accra') {
      // Auto-populate graduation date based on faculty selection
      const graduationDate = upsaFaculties[value as keyof typeof upsaFaculties] || '';
      setFormData(prev => ({ ...prev, [name]: value, graduationDate }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      // Exclude faculty field from backend submission
      const { faculty, ...submissionData } = formData;
      
      const response = await fetch(`${apiBaseUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          schoolUniversity: '',
          faculty: '',
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
        <form id="booking-form" onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
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
                  placeholder="0XX XXX XXXX (e.g., 024 123 4567)"
                  pattern="[0-9]{3}\s[0-9]{3}\s[0-9]{4}"
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
                  <option value="University of Professional Studies Accra">University of Professional Studies, Accra (UPSA)</option>
                </select>
              </div>

              {/* Faculty Selection - Only show for UPSA */}
              {formData.schoolUniversity === 'University of Professional Studies Accra' && (
                <div>
                  <label htmlFor="faculty" className="block text-sm font-semibold text-gray-700 mb-2">
                    Faculty/School *
                  </label>
                  <select
                    id="faculty"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors"
                  >
                    <option value="">Select your faculty/school</option>
                    <option value="Faculty of IT & Communication Studies">Faculty of IT & Communication Studies</option>
                    <option value="Faculty of Accounting & Finance">Faculty of Accounting & Finance</option>
                    <option value="Faculty of Management Studies">Faculty of Management Studies</option>
                    <option value="School of Graduate Studies">School of Graduate Studies</option>
                  </select>
                </div>
              )}

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
                {formData.schoolUniversity === 'University of Professional Studies Accra' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Date will auto-populate when you select your faculty, but you can modify it if needed
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Photography Package Selection - Full Width */}
          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-5">
              Graduation Photography Package *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Package */}
              <label className="relative flex flex-col p-6 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:border-amber-400">
                <input
                  type="radio"
                  name="packagePreference"
                  value="Basic Package - 250 CEDIS"
                  checked={formData.packagePreference === 'Basic Package - 250 CEDIS'}
                  onChange={handleInputChange}
                  className="absolute top-4 right-4 h-4 w-4 text-amber-600 focus:ring-amber-600 border-gray-300"
                />
                <div className="mb-3">
                  <span className="inline-block text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">BASIC</span>
                </div>
                <div className="text-2xl font-bold text-amber-600 mb-3">250 CEDIS</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                    7 pictures
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                    4 retouched
                  </div>
                </div>
              </label>

              {/* Premium Package */}
              <label className="relative flex flex-col p-6 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:border-amber-400">
                <input
                  type="radio"
                  name="packagePreference"
                  value="Premium Package - 500 CEDIS"
                  checked={formData.packagePreference === 'Premium Package - 500 CEDIS'}
                  onChange={handleInputChange}
                  className="absolute top-4 right-4 h-4 w-4 text-amber-600 focus:ring-amber-600 border-gray-300"
                />
                <div className="mb-3">
                  <span className="inline-block text-xs font-bold text-white bg-amber-600 px-3 py-1 rounded-full">PREMIUM</span>
                </div>
                <div className="text-2xl font-bold text-amber-600 mb-3">500 CEDIS</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                    10 pictures
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                    6 retouched
                  </div>
                </div>
              </label>

              {/* Deluxe Package */}
              <label className="relative flex flex-col p-6 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:border-amber-400">
                <input
                  type="radio"
                  name="packagePreference"
                  value="Deluxe Package - 700 CEDIS"
                  checked={formData.packagePreference === 'Deluxe Package - 700 CEDIS'}
                  onChange={handleInputChange}
                  className="absolute top-4 right-4 h-4 w-4 text-amber-600 focus:ring-amber-600 border-gray-300"
                />
                <div className="mb-3">
                  <span className="inline-block text-xs font-bold text-white bg-amber-800 px-3 py-1 rounded-full">DELUXE</span>
                </div>
                <div className="text-2xl font-bold text-amber-600 mb-3">700 CEDIS</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                    A group of 3
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                    25 pictures
                  </div>
                </div>
              </label>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-sm text-amber-800">
                <div className="font-semibold mb-2">Additional Services Available:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>• Extra Photos & Retouching</div>
                  <div>• Frames</div>
                </div>
                <div className="mt-3 font-semibold text-amber-900">
                  BOOKING FEE: 20 CEDIS (Non-refundable)
                </div>
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
