#!/bin/bash

# Sowl Studios - Production Deployment Script
# This script prepares and validates the project for production deployment

set -e  # Exit on any error

echo "🚀 Sowl Studios - Production Deployment Preparation"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Check if npm is installed
print_status "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

# Clean install dependencies
print_status "Installing dependencies..."
npm ci
print_success "Dependencies installed successfully"

# Run linting
print_status "Running ESLint..."
if npm run lint; then
    print_success "Linting passed"
else
    print_warning "Linting issues found. Please fix them before deploying."
fi

# Check for environment files
print_status "Checking environment configuration..."
if [ ! -f ".env.production" ]; then
    print_warning ".env.production file not found. Using template..."
    cp .env.example .env.production
fi

if [ ! -f ".env.development" ]; then
    print_warning ".env.development file not found. Using template..."
    cp .env.example .env.development
fi

print_success "Environment files checked"

# Validate environment variables
print_status "Validating environment variables..."
if grep -q "localhost" .env.production; then
    print_warning "Production environment still contains localhost URLs"
    print_warning "Please update .env.production with your actual backend URL"
fi

# Build for production
print_status "Building for production..."
if npm run build:prod; then
    print_success "Production build completed successfully"
else
    print_error "Production build failed. Please fix the errors and try again."
    exit 1
fi

# Check build output
print_status "Analyzing build output..."
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist | cut -f1)
    print_success "Build output size: $BUILD_SIZE"
    
    # List main files
    echo "Main build files:"
    ls -la dist/
else
    print_error "Build output directory not found"
    exit 1
fi

# Test production build locally
print_status "Testing production build locally..."
print_warning "Starting preview server on http://localhost:3000"
print_warning "Press Ctrl+C to stop the server and continue with deployment"

# Run preview in background and get PID
npm run preview &
PREVIEW_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server is running
if kill -0 $PREVIEW_PID 2>/dev/null; then
    print_success "Preview server started successfully (PID: $PREVIEW_PID)"
    print_warning "Please test your application at http://localhost:3000"
    print_warning "Press Enter when you're ready to continue..."
    read -r
    
    # Kill the preview server
    kill $PREVIEW_PID
    print_success "Preview server stopped"
else
    print_error "Failed to start preview server"
fi

# Deployment readiness check
print_status "Running deployment readiness check..."

READY=true

# Check for TODO comments
if grep -r "TODO\|FIXME" src/ --exclude-dir=node_modules; then
    print_warning "Found TODO/FIXME comments in code"
fi

# Check for console.log statements
if grep -r "console\.log" src/ --exclude-dir=node_modules; then
    print_warning "Found console.log statements in code"
fi

# Check package.json
if grep -q "vite-react-typescript-starter" package.json; then
    print_warning "Package name still contains template name"
fi

# Final deployment instructions
echo ""
echo "🎉 Production Build Ready!"
echo "========================="
echo ""
print_success "Your Sowl Studios application is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Update .env.production with your actual backend URL"
echo "2. Commit and push your changes to GitHub"
echo "3. Deploy to Render using one of these methods:"
echo ""
echo "   Method 1 - Automatic (render.yaml):"
echo "   • Go to https://dashboard.render.com"
echo "   • Create new Web Service"
echo "   • Connect your GitHub repository"
echo "   • Render will use render.yaml automatically"
echo ""
echo "   Method 2 - Manual Configuration:"
echo "   • Follow the detailed steps in DEPLOYMENT_GUIDE.md"
echo ""
echo "4. Update your backend CORS configuration"
echo "5. Test all functionality after deployment"
echo ""
print_status "Documentation available:"
echo "• DEPLOYMENT_GUIDE.md - Detailed deployment instructions"
echo "• PRODUCTION_CHECKLIST.md - Pre and post-deployment checklist"
echo "• README.md - Project overview and setup"
echo ""
print_success "Happy deploying! 🚀"
