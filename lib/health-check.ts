import React from 'react';
import { api } from './api';

/**
 * Health check utilities for backend connection testing
 */

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'unknown';
  message: string;
  timestamp: string;
  responseTime?: number;
}

/**
 * Performs a health check against the backend API
 */
export const performHealthCheck = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now();
  
  try {
    // Try to hit a health endpoint or any lightweight endpoint
    const response = await api.get('/health');
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      message: 'Backend is responding correctly',
      timestamp: new Date().toISOString(),
      responseTime
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    // If health endpoint doesn't exist, try a basic endpoint
    try {
      await api.get('/api/devotionals');
      return {
        status: 'healthy',
        message: 'Backend is responding (health endpoint not available)',
        timestamp: new Date().toISOString(),
        responseTime
      };
    } catch (fallbackError: any) {
      return {
        status: 'unhealthy',
        message: `Backend connection failed: ${error.message || 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        responseTime
      };
    }
  }
};

/**
 * Tests the API configuration and connection
 */
export const testApiConfiguration = async (): Promise<{
  apiUrl: string;
  isConfigured: boolean;
  healthCheck: HealthCheckResult;
}> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'Not configured';
  const isConfigured = !!process.env.NEXT_PUBLIC_API_URL && 
                      process.env.NEXT_PUBLIC_API_URL !== 'http://localhost:8080';
  
  const healthCheck = await performHealthCheck();
  
  return {
    apiUrl,
    isConfigured,
    healthCheck
  };
};

/**
 * Hook for React components to check backend status
 */
export const useBackendStatus = () => {
  const [status, setStatus] = React.useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  const checkStatus = async () => {
    setLoading(true);
    try {
      const result = await performHealthCheck();
      setStatus(result);
    } catch (error) {
      setStatus({
        status: 'unknown',
        message: 'Failed to perform health check',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    checkStatus();
  }, []);
  
  return { status, loading, checkStatus };
};

/**
 * Console logging utility for API debugging
 */
export const logApiInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔗 API Configuration');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Debug:', process.env.NEXT_PUBLIC_API_DEBUG);
    console.groupEnd();
  }
};
