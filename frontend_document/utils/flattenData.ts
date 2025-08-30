import { IDriveItem, IDriveResponse } from '@/types/driver'

export function flattenData(data: IDriveResponse[]): IDriveItem[] {
  let result: IDriveItem[] = []
  for (const item of data) {
    result.push(item)
    if (item.children) {
      result = result.concat(flattenData(item.children))
    }
  }
  result.sort((a, b) => {
    const aIsFolder = a.isFolder ? 1 : 0
    const bIsFolder = b.isFolder ? 1 : 0
    if (aIsFolder !== bIsFolder) {
      return bIsFolder - aIsFolder 
    }
    return (a.name || '').localeCompare(b.name || '')
  })
  return result
}
