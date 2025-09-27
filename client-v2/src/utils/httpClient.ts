import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration for retry logic
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Check if error is retriable (5xx errors)
const isRetriableError = (error: any): boolean => {
  if (!error.response) {
    // Network error, timeout, or other non-HTTP error - these are retriable
    return true;
  }
  
  const status = error.response.status;
  // Retry for 5xx server errors
  return status >= 500 && status < 600;
};

// Calculate delay with exponential backoff
const calculateDelay = (attempt: number, baseDelay: number, maxDelay: number): number => {
  const delay = baseDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, maxDelay);
};

// Sleep function for delays
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Generic retry wrapper for HTTP requests
async function withRetry<T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<AxiosResponse<T>> {
  let lastError: any;

  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      const response = await requestFn();
      
      // If we get here, the request succeeded
      if (attempt > 1) {
        console.log(`HTTP request succeeded on attempt ${attempt}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // If this was the last attempt, throw the error
      if (attempt > config.maxRetries) {
        console.error(`HTTP request failed after ${config.maxRetries + 1} attempts:`, error);
        throw error;
      }
      
      // Check if error is retriable
      if (!isRetriableError(error)) {
        console.log('Non-retriable error encountered, not retrying:', error);
        throw error;
      }
      
      // Calculate delay and wait before retry
      const delay = calculateDelay(attempt, config.baseDelay, config.maxDelay);
      const statusCode = (error as any)?.response?.status || 'Network Error';
      console.log(`HTTP request failed (attempt ${attempt}), retrying in ${delay}ms...`, statusCode);
      
      await sleep(delay);
    }
  }
  
  // This should never be reached, but just in case
  throw lastError;
}

// HTTP client with retry functionality
export class HttpClient {
  static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return withRetry(() => axios.get<T>(url, config));
  }

  static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return withRetry(() => axios.post<T>(url, data, config));
  }

  static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return withRetry(() => axios.put<T>(url, data, config));
  }

  static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return withRetry(() => axios.delete<T>(url, config));
  }

  static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return withRetry(() => axios.patch<T>(url, data, config));
  }
}

function getDataAPIUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return './data-api/rest/';
}

// Export the retry function for custom use cases
export { getDataAPIUrl, withRetry, DEFAULT_RETRY_CONFIG };
export type { RetryConfig };