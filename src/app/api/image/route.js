export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get('url');
  if (!url) return new Response('No url', { status: 400 });

  // Tambahkan header User-Agent dan Referer
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://suitmedia-backend.suitdev.com/',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
  });
  const contentType = res.headers.get('content-type');
  const buffer = await res.arrayBuffer();

  return new Response(buffer, {
    status: res.status,
    headers: { 'content-type': contentType }
  });
} 