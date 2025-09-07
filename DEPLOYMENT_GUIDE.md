# Sowl Studios - Production Deployment Guide

## Overview

This guide covers deploying the Sowl Studios frontend application to Render.com for production use.

## Prerequisites

### Required Accounts
- [Render.com](https://render.com) account (free tier available)
- GitHub account with your repository
- Backend API deployed and accessible

### Required Information
- **Backend API URL**: Your deployed backend service URL
- **Domain Name**: (Optional) Custom domain for your frontend
- **Environment Variables**: Production configuration values

## Deployment Methods

### Method 1: Automatic Deployment with render.yaml (Recommended)

#### Step 1: Update Configuration
1. **Update Backend URL** in `render.yaml`:
   ```yaml
   - key: VITE_API_BASE_URL
     value: https://your-actual-backend-url.onrender.com/api/v1
   - key: VITE_ACTUATOR_BASE_URL
     value: https://your-actual-backend-url.onrender.com/actuator
   ```

2. **Update Contact Information** (if needed):
   ```yaml
   - key: VITE_CONTACT_EMAIL
     value: your-actual-email@domain.com
   - key: VITE_CONTACT_PHONE
     value: your-actual-phone-number
   ```

#### Step 2: Deploy to Render
1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `sowl-studios-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build:prod`
   - **Start Command**: `npm run start`
   - **Plan**: Free (or paid for better performance)

3. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically use the `render.yaml` configuration
   - Wait for deployment to complete (5-10 minutes)

### Method 2: Manual Configuration

#### Step 1: Create Web Service
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository

#### Step 2: Configure Build Settings
```
Name: sowl-studios-frontend
Environment: Node
Build Command: npm ci && npm run build:prod
Start Command: npm run start
```

#### Step 3: Add Environment Variables
Add these environment variables in Render dashboard:

```
NODE_ENV=production
VITE_NODE_ENV=production
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
VITE_ACTUATOR_BASE_URL=https://your-backend-url.onrender.com/actuator
VITE_APP_NAME=Sowl Studios
VITE_APP_VERSION=1.0.0
VITE_CONTACT_EMAIL=info@sowlstudios.com
VITE_CONTACT_PHONE=+233 55 700 9665
VITE_ENABLE_ADMIN_DASHBOARD=true
VITE_ENABLE_SYSTEM_HEALTH=true
VITE_ENABLE_BOOKING_FORM=true
```

## Environment Configuration

### Production Environment Variables

#### Required Variables
- `VITE_API_BASE_URL`: Your backend API base URL
- `VITE_ACTUATOR_BASE_URL`: Your backend actuator endpoint URL
- `VITE_NODE_ENV`: Set to `production`

#### Optional Variables
- `VITE_GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID
- `VITE_FACEBOOK_PIXEL_ID`: Facebook Pixel ID
- Social media URLs
- Contact information

### Environment Files
- `.env.development`: Local development settings
- `.env.production`: Production settings template
- `.env.example`: Example configuration

## Build Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:prod": "vite build --mode production",
    "start": "vite preview --port 3000 --host",
    "preview": "vite preview"
  }
}
```

### Vite Configuration
- **Output Directory**: `dist/`
- **Code Splitting**: Vendor, router, and icons chunks
- **Minification**: Terser for optimal compression
- **Source Maps**: Disabled in production

## Post-Deployment Configuration

### 1. Update Backend CORS
Update your backend CORS configuration to include your Render URL:

```java
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://your-frontend-app.onrender.com"
})
```

### 2. Test Deployment
1. **Frontend Access**: Visit your Render URL
2. **API Connection**: Test booking form submission
3. **Admin Dashboard**: Test admin login and functionality
4. **System Health**: Verify health monitoring works

### 3. Custom Domain (Optional)
1. Go to your service settings in Render
2. Add custom domain
3. Update DNS records as instructed
4. Update backend CORS with new domain

## Monitoring and Maintenance

### Health Checks
- Render automatically monitors your service
- Built-in system health dashboard available at `/admin`
- Monitor logs in Render dashboard

### Performance Optimization
- **Free Tier**: Service sleeps after 15 minutes of inactivity
- **Paid Tier**: Always-on service with better performance
- **CDN**: Consider using Render's CDN for static assets

### Updates and Redeployment
- **Automatic**: Push to main branch triggers redeployment
- **Manual**: Use "Manual Deploy" in Render dashboard
- **Rollback**: Available in deployment history

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build locally
npm run build:prod

# Common fixes:
npm ci  # Clean install
npm run lint  # Fix linting errors
```

#### 2. API Connection Issues
- Verify `VITE_API_BASE_URL` is correct
- Check backend CORS configuration
- Ensure backend is deployed and accessible

#### 3. Environment Variables Not Working
- Ensure variables start with `VITE_`
- Check Render dashboard environment variables
- Redeploy after adding new variables

#### 4. Admin Dashboard Issues
- Verify backend authentication endpoints
- Check JWT token handling
- Ensure actuator endpoints are accessible

### Debug Steps
1. **Check Render Logs**: View deployment and runtime logs
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Verify API requests are working
4. **Environment**: Confirm all required variables are set

## Security Considerations

### Production Security
- All sensitive data in environment variables
- No hardcoded URLs or credentials
- HTTPS enforced by Render
- JWT tokens stored securely in localStorage

### Backend Security
- CORS properly configured
- Authentication required for admin endpoints
- Rate limiting recommended
- Input validation on all endpoints

## Cost Optimization

### Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- 750 hours/month limit (shared across services)
- Cold start delays

### Upgrade Recommendations
- **Starter Plan**: For production use
- **Pro Plan**: For high-traffic applications
- **Custom Domain**: Available on paid plans

## Support and Resources

### Documentation
- [Render Documentation](https://render.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

### Monitoring
- Render Dashboard: Service metrics and logs
- Built-in Health Dashboard: `/admin` → System Health
- Browser DevTools: Client-side debugging

---

## Quick Deployment Checklist

- [ ] Update `render.yaml` with correct backend URL
- [ ] Commit and push changes to GitHub
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Wait for deployment to complete
- [ ] Test all functionality
- [ ] Update backend CORS configuration
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and alerts

**Your Sowl Studios frontend will be live at**: `https://your-service-name.onrender.com`
