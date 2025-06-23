import { IDriveResponse } from '@/types/driver.js'
import convertSlug from './convertSlug'

export default function getContent(data: IDriveResponse[], slug: string[]) {
  let curData = data
  const path: string[] = []

  for (const segment of slug) {
    const folder = curData.find(
      (item) => item.isFolder && convertSlug(item.name) === segment,
    )
    if (!folder?.children) {
      return { path, items: [] }
    }
    path.push(folder.name)
    curData = folder.children
  }

  return {
    path,
    items: curData.map(({ children, ...rest }) => rest),
  }
}
