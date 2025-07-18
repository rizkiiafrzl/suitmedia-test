export async function GET(req) {
  // Gunakan req.nextUrl untuk parsing query params di Next.js
  const { searchParams } = req.nextUrl;
  const params = new URLSearchParams(searchParams);

  // Build target URL
  const apiUrl = `https://suitmedia-backend.suitdev.com/api/ideas?${params.toString()}`;

  // Debug: log URL dan params
  console.log('[API Proxy] Forwarding to:', apiUrl);

  // Fetch from external API
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  // Debug: log satu data untuk cek gambar
  if (Array.isArray(data.data) && data.data.length > 0) {
    const sample = data.data[0];
    console.log('[API Proxy] Sample data:', {
      id: sample.id,
      title: sample.title,
      medium_image: sample.medium_image,
      small_image: sample.small_image,
    });
    // Jika gambar tidak ada, tambahkan pesan error di response
    if (!sample.medium_image && !sample.small_image) {
      return new Response(JSON.stringify({
        error: 'Gambar tidak ditemukan pada data dari backend',
        sample,
        data,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 