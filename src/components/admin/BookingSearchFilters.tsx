import React, { useState } from 'react';
import { Search, Calendar, Filter, X, RefreshCw } from 'lucide-react';
import { adminAPI, handleApiError } from '../../utils/api';

interface BookingSearchFiltersProps {
  onSearch: (results?: any) => void;
}

interface SearchFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

const BookingSearchFilters: React.FC<BookingSearchFiltersProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    status: '',
    startDate: '',
    endDate: '',
    page: 0,
    size: 10
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Build search parameters
      const searchParams: any = {
        page: filters.page || 0,
        size: filters.size || 10,
      };

      if (filters.status) {
        searchParams.status = filters.status;
      }

      if (filters.startDate) {
        // Convert to ISO datetime format for the API
        searchParams.startDate = new Date(filters.startDate + 'T00:00:00').toISOString();
      }

      if (filters.endDate) {
        // Convert to ISO datetime format for the API
        searchParams.endDate = new Date(filters.endDate + 'T23:59:59').toISOString();
      }

      const response = await adminAPI.searchBookings(searchParams);
      onSearch(response.data);
    } catch (error) {
      console.error('Search error:', handleApiError(error));
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      startDate: '',
      endDate: '',
      page: 0,
      size: 10
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const hasActiveFilters = filters.status || filters.startDate || filters.endDate;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-amber-600" />
          Advanced Search Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Results Per Page
          </label>
          <select
            value={filters.size}
            onChange={(e) => handleFilterChange('size', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Date Range Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Date Ranges
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setFilters(prev => ({ ...prev, startDate: today, endDate: today }));
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
              setFilters(prev => ({
                ...prev,
                startDate: weekAgo.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              }));
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
              setFilters(prev => ({
                ...prev,
                startDate: monthAgo.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              }));
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const start = new Date(today.getFullYear(), today.getMonth(), 1);
              setFilters(prev => ({
                ...prev,
                startDate: start.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              }));
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            This Month
          </button>
        </div>
      </div>

      {/* Search Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Filters Active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Bookings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-amber-800 mb-2">Search Tips:</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Use date ranges to find bookings within specific periods</li>
          <li>• Filter by status to focus on specific booking states</li>
          <li>• Combine multiple filters for more precise results</li>
          <li>• Use quick date presets for common search ranges</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingSearchFilters;
