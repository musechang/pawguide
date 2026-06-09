import { fetchHotelById, FALLBACK_HOTELS } from '../../../lib/notion';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { id } = req.query;
  try {
    const hotel = await fetchHotelById(id);
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.json({ hotel });
  } catch {
    const hotel = FALLBACK_HOTELS.find(h => h.id === id) || null;
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    res.json({ hotel });
  }
}
