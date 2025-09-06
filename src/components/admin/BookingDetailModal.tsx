import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Package, 
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

interface BookingResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  schoolUniversity: string;
  graduationDate: string;
  packagePreference: string;
  preferredLocation: string;
  additionalRequests: string;
  createdAt: string;
  updatedAt: string;
  emailSent: boolean;
  smsSent: boolean;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

interface BookingDetailModalProps {
  booking: BookingResponseDto;
  onClose: () => void;
  onStatusUpdate: (bookingId: number, status: string) => void;
  onDelete: (bookingId: number) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onStatusUpdate,
  onDelete
}) => {
  const [selectedStatus, setSelectedStatus] = useState(booking.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'COMPLETED', label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' }
  ];

  const handleStatusUpdate = async () => {
    if (selectedStatus === booking.status) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(booking.id, selectedStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      onDelete(booking.id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Booking Details
              </h2>
              <p className="text-sm text-gray-600 mt-1">ID: #{booking.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-amber-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                      <p className="text-gray-900 font-medium">{booking.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                      <p className="text-gray-900 font-medium">{booking.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-gray-900">{booking.phoneNumber}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">School/University</label>
                      <p className="text-gray-900">{booking.schoolUniversity}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                    Booking Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Graduation Date</label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-gray-900">{new Date(booking.graduationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Package Preference</label>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-gray-900">{booking.packagePreference}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Preferred Location</label>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-gray-900">{booking.preferredLocation || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Requests */}
                {booking.additionalRequests && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                      Additional Requests
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{booking.additionalRequests}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-600" />
                    Timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
                      <p className="text-gray-900">{new Date(booking.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                      <p className="text-gray-900">{new Date(booking.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                  <div className="flex items-center mb-4">
                    {getStatusIcon(booking.status)}
                    <span className="ml-2 text-lg font-medium text-gray-900">{booking.status}</span>
                  </div>

                  {/* Status Update */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-600">Update Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {selectedStatus !== booking.status && (
                      <button
                        onClick={handleStatusUpdate}
                        disabled={isUpdating}
                        className="w-full flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isUpdating ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Update Status
                      </button>
                    )}
                  </div>
                </div>

                {/* Communication Status */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email Sent</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.emailSent 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.emailSent ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SMS Sent</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.smsSent 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.smsSent ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
