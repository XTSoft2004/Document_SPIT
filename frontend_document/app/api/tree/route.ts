import { NextRequest, NextResponse } from 'next/server'
import { getTree } from '@/actions/driver.actions'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://student.husc.edu.vn',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET(request: NextRequest) {
  try {
    const result = await getTree()

    if (!result.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch tree data' },
        {
          status: result.status,
          headers: corsHeaders,
        },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        data: result.data,
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
