export default async function handler(req, res) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || req.query.secret !== secret) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  try {
    await res.revalidate('/');
    await res.revalidate('/stays');

    const { fetchHotels } = await import('../../lib/notion');
    const hotels = await fetchHotels();
    const results = await Promise.allSettled(
      hotels.map(h => res.revalidate(`/stays/${h.id}`))
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed  = results.filter(r => r.status === 'rejected').length;

    return res.json({
      revalidated: true,
      pages: { '/': 'ok', '/stays': 'ok', details: `${success} ok, ${failed} failed` },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
