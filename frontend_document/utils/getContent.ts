import { IDriveItem } from '../types/driver.d.ts'
import { getSlug } from './getSlug.ts'

export default function getContent(data: IDriveItem[], path: string[]) {
  let cur = data
  const path: string[] = []

  for (const item of path) {
    const slug = getSlug({ slug: [item] })[0]
    const found = cur.find((i) => i.name === slug)
    if (!found) return { path, items: [] }
    path.push(found.name)
    cur = found.children ?? []
  }

  return {
    path,
    items: cur.map(({ children, ...item }) => item),
  }
}
