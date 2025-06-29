import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Hỗ trợ cả GET và POST để dễ gọi
export async function GET(request: NextRequest) {
  return handleRevalidate(request)
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request)
}

async function handleRevalidate(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag') || 'tree'
    
    if (tag === 'tree' || tag === 'all') {
      revalidateTag('driver.tree')
    }
    
    if (tag === 'all') {
      revalidateTag('driver.folder')
      revalidateTag('driver.thumbnail')
    }

    return NextResponse.json({ 
      revalidated: true, 
      message: `Cache cleared successfully for: ${tag}`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    )
  }
}
