import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

type FetcherFn<T> = () => Promise<T>

export function useRequestSWR<T>(
  key: string,
  fetcher: FetcherFn<T>,
  config?: SWRConfiguration,
) {
  const wrappedFetcher = async () => await fetcher()

  const { data, error, isLoading, mutate } = useSWR<T>(
    key,
    wrappedFetcher,
    config,
  )

  return {
    data,
    error,
    isError: !!error,
    isLoading,
    mutate,
  }
}
