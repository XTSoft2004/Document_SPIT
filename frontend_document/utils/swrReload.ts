// Reload lại dữ liệu SWR
export function reloadSWR(eventName: string = 'reload-datagrid') {
  window.dispatchEvent(new Event(eventName))
}
