import { NextRequest, NextResponse } from 'next/server'
import { getTree } from '@/actions/driver.actions'
import { IDriveResponse } from '@/types/driver'
import convertSlug from '@/utils/convertSlug'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://student.husc.edu.vn',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const dataTree = await getTree()

    if (!dataTree.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch tree data' },
        {
          status: dataTree.status,
          headers: corsHeaders,
        },
      )
    }

    const findFolderIdParent = (
      node: IDriveResponse,
      target: string,
      currentPath: string,
    ): string | null => {
      if (!node.children || node.children.length === 0) {
        return null
      }

      if (node.children.some((child) => child.courseCode === target)) {
        return currentPath
      }

      for (const child of node.children) {
        if (child.isFolder) {
          const p = `${currentPath}${convertSlug(child.name)}/`
          const result = findFolderIdParent(child, target, p)
          if (result) return result
        }
      }

      return null
    }

    const paths = []
    for (const course of body.courses) {
      let path
      for (const node of dataTree.data) {
        path = findFolderIdParent(node, course, `${convertSlug(node.name)}/`)
        if (path) {
          const pathParts = path.split('/').filter(Boolean)
          const parentPath = pathParts.slice(0, pathParts.length - 1).join('/')
          paths.push({ course, path: parentPath })
          break
        }
      }
    }

    return NextResponse.json(
      {
        ok: true,
        data: paths,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error) {
    console.error('Error fetching tree data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
