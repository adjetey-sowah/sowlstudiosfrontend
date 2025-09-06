// API utility functions for admin dashboard

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Get auth headers with JWT token
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin';
      throw new Error('Unauthorized - please login again');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Specific API functions for admin operations

export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
};

export const adminAPI = {
  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  getBookings: async (page = 0, size = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }

    return apiRequest(`/admin/bookings?${params}`);
  },

  getBookingById: async (id: number) => {
    return apiRequest(`/admin/bookings/${id}`);
  },

  updateBookingStatus: async (id: number, status: string) => {
    return apiRequest(`/admin/bookings/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  deleteBooking: async (id: number) => {
    return apiRequest(`/admin/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  searchBookings: async (params: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return apiRequest(`/admin/bookings/search?${searchParams}`);
  },
};

// System Health API functions
export const systemAPI = {
  getHealth: async () => {
    return apiRequest('/health');
  },

  getInfo: async () => {
    return apiRequest('/info');
  },
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};
