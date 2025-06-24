import { mutate } from 'swr'

// Reload lại dữ liệu SWR
export function reloadSWR(eventName: string = 'reload-datagrid') {
  window.dispatchEvent(new Event(eventName))
}

// Reload specific table by name với mutate trực tiếp
export function reloadTable(
  tableName: string,
  searchText: string = '',
  pageIndex: number = 1,
  pageSize: number = 10,
) {
  // Mutate trực tiếp với key đơn giản để có trải nghiệm mượt mà
  mutate([tableName, searchText, pageIndex, pageSize])

  // Fallback: thử dùng global mutate function nếu có
  const mutateFunction = (window as any)[`mutate_${tableName}`]
  if (mutateFunction) {
    mutateFunction()
  }
}

// Wrapper cho việc mutate đơn giản
export function mutateTable(
  tableName: string,
  searchText: string = '',
  pageIndex: number = 1,
  pageSize: number = 10,
) {
  mutate([tableName, searchText, pageIndex, pageSize])
}

// Expose ra global window để có thể test từ console
if (typeof window !== 'undefined') {
  ;(window as any).mutateTable = mutateTable
}
