// Supabase service layer with retry logic
import { supabase } from "@/integrations/supabase/client";

interface RetryOptions {
  maxRetries?: number;
  timeout?: number;
  backoffMs?: number;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 2,
  timeout: 10000,
  backoffMs: 1000,
};

export async function withRetry<T>(
  fn: () => Promise<T> | PromiseLike<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries!; attempt++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), opts.timeout)
      );

      const result = await Promise.race([Promise.resolve(fn()), timeoutPromise]);
      return result as T;
    } catch (error) {
      lastError = error as Error;

      if (attempt < opts.maxRetries!) {
        await new Promise((resolve) =>
          setTimeout(resolve, opts.backoffMs! * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError || new Error("Request failed");
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

// Export supabase client
export { supabase };
