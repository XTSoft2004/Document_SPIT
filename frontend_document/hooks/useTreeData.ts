import useSWR from 'swr'
import { IDriveResponse } from '@/types/driver'
import { IIndexResponse } from '@/types/global'

const fetcher = async (url: string): Promise<IDriveResponse[]> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch tree data')
  }
  const data: IIndexResponse<IDriveResponse> = await response.json()
  return data.data
}

export const useTreeData = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/tree', fetcher, {
    refreshInterval: 5,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}
