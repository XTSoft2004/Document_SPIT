import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

type FetcherFn<T> = () => Promise<T>

export function useRequestSWR<T>(
  key: string | null,
  fetcher: FetcherFn<T>,
  config?: SWRConfiguration,
) {
  const wrappedFetcher = async () => {
    try {
      return await fetcher()
    } catch (error) {
      console.error(`SWR fetch error for key "${key}":`, error)
      throw error
    }
  }

  const { data, error, isLoading, mutate, isValidating } = useSWR<T>(
    key,
    wrappedFetcher,
    {
      // Default configuration for better UX
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      // Override with user config
      ...config,
    },
  )

  return {
    data,
    error,
    isError: !!error,
    isLoading,
    isValidating,
    mutate,
    // Helper methods
    refresh: () => mutate(),
  }
}
