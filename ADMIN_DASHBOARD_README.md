# Sowl Studios Admin Dashboard

A comprehensive admin dashboard for managing graduation photography bookings, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### 📊 Statistics Dashboard
- **Overview Metrics**: Total bookings, today's bookings, weekly/monthly stats
- **Status Breakdown**: Pending, confirmed, completed, and cancelled bookings
- **Package Analytics**: Popular package preferences with visual breakdown
- **Quick Actions**: Direct access to common admin tasks
- **Real-time Updates**: Refresh statistics on demand

### 📋 Bookings Management
- **Comprehensive Table View**: All booking details in an organized table
- **Advanced Filtering**: Filter by status, date ranges, and custom criteria
- **Pagination**: Efficient handling of large datasets
- **Status Management**: Update booking status with one click
- **Bulk Operations**: Delete bookings with confirmation prompts

### 🔍 Advanced Search & Filters
- **Date Range Filtering**: Custom date ranges with preset options (Today, Last 7 days, etc.)
- **Status Filtering**: Filter by booking status (Pending, Confirmed, Completed, Cancelled)
- **Quick Date Presets**: One-click filters for common date ranges
- **Results Per Page**: Customizable pagination size
- **Search Tips**: Built-in help for effective searching

### 📱 Booking Detail Management
- **Detailed View Modal**: Complete booking information in an elegant modal
- **Customer Information**: Full contact and academic details
- **Booking Timeline**: Creation and update timestamps
- **Communication Status**: Email and SMS delivery tracking
- **Status Updates**: Real-time status changes with visual feedback
- **Action Controls**: Delete bookings with confirmation

### 🔐 Authentication & Security
- **Secure Login**: Username/password authentication
- **Session Management**: Persistent login with token storage
- **Protected Routes**: Admin-only access to dashboard features
- **Demo Credentials**: Built-in demo access for testing

## 🛠 Technical Implementation

### API Integration
The dashboard integrates with the following backend endpoints:

#### Statistics Endpoint
```
GET /api/v1/admin/stats
```
Returns comprehensive booking statistics including totals, status breakdowns, and package preferences.

#### Bookings Management
```
GET /api/v1/admin/bookings?page=0&size=10&status=PENDING
PUT /api/v1/admin/bookings/{id}/status?status=CONFIRMED
DELETE /api/v1/admin/bookings/{id}
GET /api/v1/admin/bookings/{id}
```

#### Advanced Search
```
GET /api/v1/admin/bookings/search?status=PENDING&startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59&page=0&size=10
```

### Data Models

#### BookingResponseDto
```typescript
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
```

#### BookingStatsDto
```typescript
interface BookingStatsDto {
  totalBookings: number;
  todayBookings: number;
  weeklyBookings: number;
  monthlyBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  packageStats: Record<string, number>;
}
```

## 🎨 Design System

### Color Scheme
- **Primary**: Amber (matches main website branding)
- **Status Colors**: 
  - Pending: Yellow
  - Confirmed: Green
  - Completed: Blue
  - Cancelled: Red

### Typography
- **Headers**: Serif font family (consistent with main site)
- **Body**: Sans-serif for readability
- **Weights**: Light, medium, semibold, bold

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent hover states and transitions
- **Tables**: Zebra striping with hover effects
- **Modals**: Backdrop blur with smooth animations

## 🚀 Getting Started

### Access the Dashboard
1. Navigate to `/admin` in your browser
2. Use demo credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

### Navigation
- **Dashboard**: Overview statistics and quick actions
- **Bookings**: Comprehensive booking management
- **Settings**: Configuration options (coming soon)

### Key Workflows

#### Managing Bookings
1. Go to Bookings tab
2. Use filters to find specific bookings
3. Click on any booking to view details
4. Update status or delete as needed

#### Viewing Statistics
1. Dashboard tab shows real-time stats
2. Click "Refresh Stats" to update data
3. Use package breakdown for insights

#### Advanced Search
1. Click "Filters" button in Bookings
2. Set date ranges and status filters
3. Use quick presets for common searches
4. Click "Search Bookings" to apply

## 🔧 Configuration

### API Endpoints
Update the base URL in components if your backend runs on a different port:
```typescript
const API_BASE = 'http://localhost:8000/api/v1/admin';
```

### Authentication
The dashboard uses localStorage for session management. In production, implement proper JWT validation.

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Collapsible sidebar with touch-friendly controls
- **Mobile**: Hamburger menu with optimized layouts

## 🎯 Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Export Functionality**: CSV/PDF export of booking data
- **Advanced Analytics**: Charts and graphs for trend analysis
- **Bulk Operations**: Multi-select for batch actions
- **User Management**: Multiple admin accounts with role-based access
- **Email Templates**: Customizable notification templates
- **Calendar Integration**: Visual calendar view of bookings

## 🐛 Troubleshooting

### Common Issues
1. **Login Issues**: Ensure backend is running on port 8000
2. **Data Not Loading**: Check browser console for API errors
3. **Styling Issues**: Verify Tailwind CSS is properly configured

### Debug Mode
Enable debug logging by adding to localStorage:
```javascript
localStorage.setItem('debug', 'true');
```

## 📄 License

This admin dashboard is part of the Sowl Studios project and follows the same licensing terms.
