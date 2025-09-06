# System Health Monitoring Dashboard

## Overview

The System Health Monitoring Dashboard provides comprehensive real-time monitoring of your Sowl Studios backend services, including custom API endpoints and Spring Boot Actuator metrics.

## Features

### 🔍 **Health Monitoring**
- **API Service Status**: Custom health endpoint monitoring
- **Spring Boot Actuator**: Built-in health checks
- **Database Connection**: Real-time database status
- **Disk Space**: Storage monitoring
- **Component Status**: Individual service component health

### 📊 **System Information**
- **Application Details**: Version, description, contact info
- **Build Information**: Build time and version details
- **Java Runtime**: JVM version and vendor information
- **System Components**: Detailed component status breakdown

### 🔄 **Real-time Updates**
- **Auto-refresh**: Every 30 seconds
- **Manual Refresh**: On-demand updates
- **Last Updated**: Timestamp tracking
- **Error Handling**: Graceful error display and recovery

## Endpoints Monitored

### Custom API Endpoints
```
GET /api/v1/health
GET /api/v1/info
```

### Spring Boot Actuator Endpoints
```
GET /actuator/health
GET /actuator/info
GET /actuator/metrics (future enhancement)
```

## Configuration Required

### Backend Configuration

Add to your `application.yml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
```

### CORS Configuration

Ensure your backend allows requests from the frontend:

```java
@CrossOrigin(origins = {"${app.cors.allowed-origins}"})
```

## Component Structure

### SystemHealth.tsx
- Main monitoring dashboard component
- Handles all API calls and state management
- Auto-refresh functionality
- Error handling and recovery

### API Integration
- Uses centralized API utility (`src/utils/api.ts`)
- JWT authentication for secured endpoints
- Proper error handling and 401 redirects

## Health Status Indicators

### Status Colors
- 🟢 **Green (UP)**: Service is healthy and operational
- 🔴 **Red (DOWN)**: Service is experiencing issues
- 🟡 **Yellow (UNKNOWN)**: Status cannot be determined
- ⚪ **Gray**: No data available

### Monitored Components
- **API Service**: Custom application health
- **Spring Boot**: Actuator health status
- **Database**: Connection and query status
- **Disk Space**: Available storage monitoring
- **Ping**: Network connectivity checks

## Usage

### Accessing the Dashboard
1. Navigate to `/admin` in your browser
2. Login with admin credentials
3. Click on "System Health" in the sidebar
4. View real-time system status

### Understanding the Dashboard

#### Overview Cards
- Quick status overview of major components
- Color-coded status indicators
- Service names and descriptions

#### Application Information
- Application metadata
- Version information
- Build details
- Java runtime information

#### System Components
- Detailed breakdown of all monitored components
- Individual status for each service
- Component-specific icons and descriptions

#### Health Timeline
- Last health check timestamp
- Auto-refresh status
- Service uptime information

## Troubleshooting

### Common Issues

#### 401 Unauthorized
- Ensure admin is logged in
- Check JWT token validity
- Verify backend authentication configuration

#### Connection Errors
- Verify backend is running on `http://localhost:8000`
- Check CORS configuration
- Ensure actuator endpoints are enabled

#### Missing Data
- Verify actuator endpoints are exposed
- Check Spring Boot configuration
- Ensure proper permissions for health details

### Error Recovery
- Dashboard automatically handles errors gracefully
- Manual refresh button available
- Error messages provide specific details
- Auto-retry on network recovery

## Future Enhancements

### Planned Features
- **Metrics Dashboard**: CPU, memory, and performance metrics
- **Alert System**: Notifications for service issues
- **Historical Data**: Health status trends and history
- **Custom Thresholds**: Configurable alert thresholds
- **Export Functionality**: Health reports and logs

### Additional Endpoints
- `/actuator/metrics` - Performance metrics
- `/actuator/env` - Environment information
- `/actuator/loggers` - Log level management
- Custom business metrics endpoints

## Security Considerations

### Authentication
- All endpoints require valid JWT authentication
- Admin-only access to sensitive health information
- Secure token storage and validation

### Data Privacy
- Health information is admin-restricted
- No sensitive data exposed in health checks
- Proper error handling without data leakage

## API Response Examples

### Health Endpoint Response
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "UP",
    "timestamp": "2024-01-15T10:30:00",
    "service": "Photography Booking API",
    "version": "1.0.0"
  }
}
```

### Actuator Health Response
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 499963174912,
        "free": 91943821312,
        "threshold": 10485760
      }
    }
  }
}
```

## Support

For issues or questions regarding the System Health Monitoring Dashboard:

1. Check the browser console for error details
2. Verify backend logs for API issues
3. Ensure all required endpoints are accessible
4. Contact system administrator for configuration issues

---

**Note**: This monitoring dashboard is designed for administrative use only and requires proper authentication and authorization.
