// Network resilience wrapper with timeout and retries

interface NetworkOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

const DEFAULT_OPTIONS: NetworkOptions = {
  timeout: 10000, // 10s
  retries: 2,
  retryDelay: 1000, // exponential backoff base
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: NetworkOptions = {}
): Promise<T> {
  const { timeout, retries, retryDelay } = { ...DEFAULT_OPTIONS, ...options };
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries!; attempt++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      );
      
      const result = await Promise.race([fn(), timeoutPromise]);
      return result as T;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries!) {
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay! * Math.pow(2, attempt))
        );
      }
    }
  }
  
  throw lastError || new Error('Request failed');
}
