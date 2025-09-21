import { NextRequest, NextResponse } from 'next/server'
import { getTree } from '@/actions/driver.actions'

export async function GET(request: NextRequest) {
  try {
    const result = await getTree()

    if (!result.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch tree data' },
        {
          status: result.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        data: result.data,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching tree data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }
}
