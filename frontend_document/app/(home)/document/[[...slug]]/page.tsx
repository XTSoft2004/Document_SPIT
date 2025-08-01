'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import DocumentPageWrapper from '@/components/ui/Document/DocumentPageWrapper'

type PageProps = {
  params: {
    slug?: string[]
  }
}

export default function DocumentPage({ params }: PageProps) {
  const router = useRouter()

  const rawSlug = params.slug || []
  const hasReload = rawSlug.some((s) => s.startsWith('_'))
  const slug = rawSlug.filter((s) => !s.startsWith('_'))

  const slugPath = slug.join('/')

  useEffect(() => {
    if (hasReload) {
      const cleanPath = `/document/${slugPath}`
      router.replace(cleanPath)
    }
  }, [hasReload, slugPath, router])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <DocumentPageWrapper slug={slug} />
    </div>
  )
}
