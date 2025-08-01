import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    const url = `http://backend:5000/document/download/${id}`
    const response = await fetch(url, {
        method: 'GET',
    })

    const blob = await response.blob()
    return new Response(blob, {
        headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
            'Content-Disposition': response.headers.get('Content-Disposition') || 'inline',
        },
    })
}
