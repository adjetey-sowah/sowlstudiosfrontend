<<<<<<< HEAD
# sowlstudiosfrontend
My Photography website
=======
# Sowl Studios - Professional Photography Website

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Overview

Sowl Studios is a modern, responsive photography website built with React, TypeScript, and Tailwind CSS. It features a comprehensive admin dashboard for managing bookings and monitoring system health.

## Features

### 🎨 **Frontend Features**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional design with smooth animations
- **Image Gallery**: Lightbox gallery with category filtering
- **Booking System**: Integrated booking form with validation
- **Team Showcase**: Professional team member profiles
- **Client Testimonials**: Customer feedback display
- **Partner Logos**: Business partner showcase

### 🔧 **Admin Dashboard**
- **Authentication**: Secure JWT-based admin login
- **Booking Management**: View, update, and manage bookings
- **Statistics Dashboard**: Real-time booking analytics
- **System Health**: Comprehensive health monitoring
- **Responsive Design**: Mobile-friendly admin interface

### 📊 **System Monitoring**
- **API Health Checks**: Custom health endpoints
- **Spring Boot Actuator**: Built-in health monitoring
- **Database Status**: Real-time connection monitoring
- **Component Health**: Individual service status tracking

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend Integration
- **Spring Boot** REST API
- **JWT Authentication** for admin access
- **Spring Boot Actuator** for health monitoring
- **PostgreSQL** database support

## Quick Start

### Development Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd sowl-studios

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development

# Start development server
npm run dev
```

### Production Build
```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview
```

## Environment Configuration

### Required Environment Variables
```env
VITE_API_BASE_URL=https://your-backend-url.com/api/v1
VITE_ACTUATOR_BASE_URL=https://your-backend-url.com/actuator
VITE_NODE_ENV=production
```

### Optional Configuration
```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXX
VITE_CONTACT_EMAIL=info@sowlstudios.com
VITE_CONTACT_PHONE=+233 55 700 9665
```

## Deployment

### Deploy to Render (Recommended)

#### Option 1: One-Click Deploy
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

#### Option 2: Manual Deploy
1. **Fork this repository**
2. **Create a new Web Service** on Render
3. **Connect your GitHub repository**
4. **Configure build settings**:
   - Build Command: `npm ci && npm run build:prod`
   - Start Command: `npm run start`
5. **Add environment variables** (see `.env.production`)
6. **Deploy**

### Other Platforms
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS S3**: Static hosting with CloudFront

## Project Structure

```
sowl-studios/
├── public/                 # Static assets
│   ├── gallery/           # Gallery images
│   └── team/              # Team member photos
├── src/
│   ├── components/        # React components
│   │   ├── admin/         # Admin dashboard components
│   │   ├── About.tsx      # About section
│   │   ├── Gallery.tsx    # Image gallery
│   │   ├── BookingForm.tsx # Booking form
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   └── api.ts         # API integration
│   └── App.tsx            # Main application
├── .env.example           # Environment template
├── .env.production        # Production environment
├── render.yaml            # Render deployment config
└── DEPLOYMENT_GUIDE.md    # Detailed deployment guide
```

## API Integration

### Booking Endpoints
```typescript
POST /api/v1/bookings          # Create booking
GET  /api/v1/admin/bookings    # List bookings (admin)
PUT  /api/v1/admin/bookings/:id/status # Update status (admin)
```

### Authentication Endpoints
```typescript
POST /api/v1/auth/login        # Admin login
POST /api/v1/auth/logout       # Admin logout
GET  /api/v1/auth/profile      # Get admin profile
```

### Health Monitoring
```typescript
GET  /api/v1/health            # Custom health check
GET  /api/v1/info              # Application info
GET  /actuator/health          # Spring Boot health
GET  /actuator/info            # Spring Boot info
```

## Admin Dashboard

### Access
- **URL**: `/admin`
- **Login**: Use your backend admin credentials
- **Features**: Booking management, statistics, system health

### Sections
1. **Dashboard**: Overview and statistics
2. **Bookings**: Manage customer bookings
3. **System Health**: Monitor backend services
4. **Settings**: Configuration and tools

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:prod   # Build with production config
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (recommended)
- **Husky**: Git hooks for quality checks (optional)

## Performance

### Optimization Features
- **Code Splitting**: Vendor and route-based splitting
- **Tree Shaking**: Remove unused code
- **Minification**: Terser for optimal compression
- **Lazy Loading**: Admin components loaded on demand
- **Image Optimization**: Compressed gallery images

### Performance Metrics
- **Lighthouse Score**: 90+ target
- **Bundle Size**: < 500KB gzipped
- **Load Time**: < 3 seconds
- **First Contentful Paint**: < 2 seconds

## Security

### Frontend Security
- **Environment Variables**: Sensitive data in env vars
- **JWT Handling**: Secure token storage
- **Input Validation**: Form validation and sanitization
- **HTTPS**: Enforced in production

### Backend Requirements
- **CORS Configuration**: Proper origin restrictions
- **Authentication**: JWT-based admin access
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Server-side validation

## Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Support
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 14+

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design
- Add proper error handling
- Include loading states

## Support

### Documentation
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [System Health README](./SYSTEM_HEALTH_README.md)

### Getting Help
- Check the documentation files
- Review the code comments
- Open an issue for bugs
- Contact the development team

## License

This project is proprietary software for Sowl Studios.

---

**Live Demo**: [https://your-app.onrender.com](https://your-app.onrender.com)
**Admin Dashboard**: [https://your-app.onrender.com/admin](https://your-app.onrender.com/admin)
>>>>>>> 78524f7 (Prepared for deployment)
