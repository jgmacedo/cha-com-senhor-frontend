# Backend Integration Guide - Coolify + Next.js

## Overview
This guide explains how to integrate your Java Spring Boot backend (deployed on Coolify) with your Next.js frontend.

## Current Setup
- **Frontend**: Next.js app (this repository)
- **Backend**: Java Spring Boot API on Coolify
- **API Client**: Axios configured in `/lib/api.ts`

## Integration Steps

### 1. Backend URL Configuration

#### For Development:
Create `.env.local` file in your project root:
```bash
# Development - use your Coolify backend URL
NEXT_PUBLIC_API_URL=https://your-backend-domain.coolify.app

# If your backend is on a custom domain:
# NEXT_PUBLIC_API_URL=https://api.chacomsenhor.com
```

#### For Production (Vercel):
Add environment variables in Vercel dashboard:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-domain.coolify.app`

### 2. CORS Configuration (Backend)

Your Spring Boot backend needs to allow requests from your frontend domain. Add this to your backend:

```java
@Configuration
@EnableWebSecurity
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow your frontend domains
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",           // Development
            "https://*.vercel.app",            // Vercel deployments
            "https://your-frontend-domain.com" // Custom domain
        ));
        
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
        
        configuration.setAllowedHeaders(Arrays.asList(
            "authorization", "content-type", "x-auth-token"
        ));
        
        configuration.setExposedHeaders(Arrays.asList(
            "x-auth-token"
        ));
        
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 3. API Endpoints Structure

Based on your frontend components, ensure your backend provides these endpoints:

#### Authentication:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

#### Devotionals:
- `GET /api/devotionals` - List devotionals
- `POST /api/devotionals` - Create devotional (admin)
- `PUT /api/devotionals/{id}` - Update devotional (admin)
- `DELETE /api/devotionals/{id}` - Delete devotional (admin)

#### Bible Verses:
- `GET /api/bible-verses` - List bible verses
- `POST /api/bible-verses` - Create bible verse (admin)
- `PUT /api/bible-verses/{id}` - Update bible verse (admin)
- `DELETE /api/bible-verses/{id}` - Delete bible verse (admin)

#### Users (Admin):
- `GET /api/users` - List users (admin only)
- `PUT /api/users/{id}` - Update user (admin)
- `DELETE /api/users/{id}` - Delete user (admin)

### 4. Environment Variables Setup

Update your `.env.example`:
```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.coolify.app

# Optional: API versioning
NEXT_PUBLIC_API_VERSION=v1

# Optional: Enable API debugging in development
NEXT_PUBLIC_API_DEBUG=true
```

### 5. Update Next.js Configuration

Add your backend domain to the images configuration in `next.config.mjs`:

```javascript
images: {
  domains: [
    'localhost',
    'your-backend-domain.coolify.app', // Add your Coolify domain
    'api.chacomsenhor.com'             // If using custom domain
  ],
  unoptimized: true,
},
```

### 6. API Client Enhancements

The current API client in `/lib/api.ts` is well-configured. Consider adding:

#### Health Check Function:
```typescript
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
};
```

#### Retry Logic:
```typescript
import axios from 'axios';

// Add retry configuration
api.defaults.timeout = 10000; // 10 seconds

// Retry interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    if (!config || config.retry === false) {
      return Promise.reject(error);
    }
    
    config.retryCount = config.retryCount || 0;
    
    if (config.retryCount < 3 && error.response?.status >= 500) {
      config.retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retryCount));
      return api(config);
    }
    
    return Promise.reject(error);
  }
);
```

### 7. Deployment Considerations

#### Vercel Deployment (Recommended):
1. Set environment variables in Vercel dashboard
2. Ensure `NEXT_PUBLIC_API_URL` points to your Coolify backend
3. Deploy using `vercel --prod` or connect your GitHub repository to Vercel

Vercel automatically handles Next.js deployments without requiring any additional configuration files.

### 8. Testing the Integration

Create a simple test to verify backend connection:

```typescript
// Add to a component or create a test file
const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    
    const response = await api.get('/health');
    console.log('Backend connection successful:', response.data);
  } catch (error) {
    console.error('Backend connection failed:', error);
  }
};
```

### 9. Security Considerations

#### HTTPS Only:
Ensure your Coolify backend uses HTTPS in production.

#### API Keys:
If your backend requires API keys, add them to environment variables:
```bash
NEXT_PUBLIC_API_KEY=your-api-key
```

#### Rate Limiting:
Consider implementing rate limiting on your backend to prevent abuse.

### 10. Monitoring and Logging

#### Frontend Logging:
```typescript
// Add to api.ts
const logApiCall = (config: any, response?: any, error?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('API Call:', {
      url: config.url,
      method: config.method,
      status: response?.status || error?.response?.status,
      timestamp: new Date().toISOString()
    });
  }
};
```

#### Backend Health Monitoring:
Consider adding a health check endpoint that your frontend can periodically call.

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your backend CORS configuration includes your frontend domain
2. **404 Errors**: Verify API endpoint URLs match between frontend and backend
3. **Authentication Issues**: Check JWT token format and expiration
4. **Network Timeouts**: Increase timeout values or implement retry logic

### Debug Steps:

1. Check browser Network tab for failed requests
2. Verify environment variables are loaded correctly
3. Test API endpoints directly using curl or Postman
4. Check backend logs in Coolify dashboard

## Next Steps

1. Set up your backend URL in environment variables
2. Test the connection with a simple API call
3. Implement proper error handling for production
4. Set up monitoring and logging
5. Consider implementing caching for better performance

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your backend is accessible from the internet
3. Ensure CORS is properly configured on your backend
4. Test API endpoints independently before integrating
