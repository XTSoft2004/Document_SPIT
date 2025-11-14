import { NextRequest } from 'next/server'
import { getCodeView } from '@/actions/document.actions'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const response = await getCodeView(Number(id))

  return new Response(JSON.stringify(response.data), {
    headers: { 'Content-Type': 'application/json' },
  })
}
