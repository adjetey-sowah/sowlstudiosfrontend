import React, { useState, useEffect } from 'react';
import { DollarSign, Filter, TrendingUp, BarChart3 } from 'lucide-react';
import { adminAPI, handleApiError } from '../../utils/api';

interface SalesFilters {
  startDate: string;
  endDate: string;
  status: string;
}

interface SalesStatsProps {
  className?: string;
}

interface SalesChartData {
  period: string;
  amount: number;
}

interface SalesResponse {
  totalSales: number;
  bookingsCount?: number;
  averageAmount?: number;
}

// Simple Sales Chart Component
const SalesChart: React.FC<{ data: SalesChartData[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No sales data available</p>
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.amount));
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Sales Trend</h4>
        <BarChart3 className="h-5 w-5 text-amber-600" />
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-20 text-sm font-medium text-gray-600 truncate">
              {item.period}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ width: `${maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0}%` }}
              >
                {item.amount > 0 && (
                  <span className="text-xs font-medium text-white">
                    ₵{item.amount.toFixed(0)}
                  </span>
                )}
              </div>
            </div>
            <div className="w-16 text-sm font-semibold text-gray-900 text-right">
              ₵{item.amount.toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SalesStats: React.FC<SalesStatsProps> = ({ className = '' }) => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalesFilters>({
    startDate: '',
    endDate: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [chartData, setChartData] = useState<SalesChartData[]>([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async (customFilters?: Partial<SalesFilters>) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = customFilters || filters;
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '')
      );

      const response = await adminAPI.getTotalSales(cleanParams);
      // Handle the response structure properly
      const salesData = response as SalesResponse;
      const totalAmount = salesData.totalSales || 0;
      setTotalSales(totalAmount);
      
      // Generate mock chart data based on current filters or default periods
      generateChartData(totalAmount, params);
    } catch (err) {
      setError(handleApiError(err));
      setTotalSales(0);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (totalAmount: number, currentFilters: Partial<SalesFilters>) => {
    // Generate mock data for visualization - in a real app, this would come from the API
    const mockData: SalesChartData[] = [];
    
    if (currentFilters.startDate && currentFilters.endDate) {
      // Generate data based on date range
      const start = new Date(currentFilters.startDate);
      const end = new Date(currentFilters.endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) {
        // Daily breakdown for week or less
        for (let i = 0; i <= daysDiff; i++) {
          const date = new Date(start);
          date.setDate(start.getDate() + i);
          mockData.push({
            period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: Math.random() * (totalAmount / (daysDiff + 1)) * 2
          });
        }
      } else if (daysDiff <= 31) {
        // Weekly breakdown for month
        const weeksCount = Math.ceil(daysDiff / 7);
        for (let i = 0; i < weeksCount; i++) {
          mockData.push({
            period: `Week ${i + 1}`,
            amount: Math.random() * (totalAmount / weeksCount) * 2
          });
        }
      } else {
        // Monthly breakdown for longer periods
        const monthsCount = Math.ceil(daysDiff / 30);
        for (let i = 0; i < monthsCount; i++) {
          const date = new Date(start);
          date.setMonth(start.getMonth() + i);
          mockData.push({
            period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            amount: Math.random() * (totalAmount / monthsCount) * 2
          });
        }
      }
    } else {
      // Default last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        mockData.push({
          period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount: Math.random() * (totalAmount / 7) * 2
        });
      }
    }
    
    setChartData(mockData);
  };

  const handleFilterChange = (key: keyof SalesFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchSales(filters);
  };

  const clearFilters = () => {
    const clearedFilters = { startDate: '', endDate: '', status: '' };
    setFilters(clearedFilters);
    fetchSales(clearedFilters);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getQuickFilterButtons = () => [
    {
      label: 'Today',
      onClick: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayFilters = { startDate: today, endDate: today, status: '' };
        setFilters(todayFilters);
        fetchSales(todayFilters);
      }
    },
    {
      label: 'This Week',
      onClick: () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        const weekFilters = {
          startDate: startOfWeek.toISOString().split('T')[0],
          endDate: endOfWeek.toISOString().split('T')[0],
          status: ''
        };
        setFilters(weekFilters);
        fetchSales(weekFilters);
      }
    },
    {
      label: 'This Month',
      onClick: () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const monthFilters = {
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0],
          status: ''
        };
        setFilters(monthFilters);
        fetchSales(monthFilters);
      }
    },
    {
      label: 'Completed Only',
      onClick: () => {
        const completedFilters = { ...filters, status: 'COMPLETED' };
        setFilters(completedFilters);
        fetchSales(completedFilters);
      }
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Sales Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
              <p className="text-sm text-gray-600">Revenue from bookings</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatCurrency(totalSales)}
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Based on current filters</span>
            </div>
          </div>
        )}
      </div>

      {/* Sales Chart */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <SalesChart data={chartData} />
        </div>
      )}

      {/* Quick Filter Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {getQuickFilterButtons().map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors text-sm font-medium"
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesStats;
