import { fetchHotels, FALLBACK_HOTELS } from '../../lib/notion';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const hotels = await fetchHotels();
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.json({ hotels });
  } catch (err) {
    console.error('[API] /api/hotels error:', err);
    res.json({ hotels: FALLBACK_HOTELS });
  }
}
