import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const url = `http://backend:5000/document/view/${id}`;
    const response = await fetch(url, {
        method: 'GET',
    });

    // Lấy content-type để xác định là ảnh hay pdf
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('Content-Disposition') || 'inline';

    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': contentDisposition,
        },
    });
}
