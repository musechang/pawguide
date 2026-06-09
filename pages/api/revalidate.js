/*
  /api/revalidate
  On-demand revalidation endpoint.

  用法：
    GET /api/revalidate?secret=YOUR_SECRET
    → 立即重新生成所有旅宿頁面的靜態快取

  設定方式（Vercel）：
    1. 在 Vercel Dashboard → Settings → Environment Variables
    2. 新增 REVALIDATE_SECRET = 任意一組密碼字串
    3. 呼叫時帶上這組 secret 即可觸發更新

  Notion Webhook 自動觸發：
    → 見 README 或下方說明
*/
export default async function handler(req, res) {
  const secret = process.env.REVALIDATE_SECRET;

  // 驗證 secret
  if (!secret || req.query.secret !== secret) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  try {
    // 重新生成首頁、列表頁
    await res.revalidate('/');
    await res.revalidate('/stays');

    // 重新生成所有物件詳細頁
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
