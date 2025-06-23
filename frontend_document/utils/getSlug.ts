import convertSlug from './convertSlug'

export default function getSlug(params: { slug: string[] }) {
  const { slug } = params
  if (slug == undefined) return []
  else return slug.map((item) => convertSlug(item))
}
