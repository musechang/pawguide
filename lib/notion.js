/* ══════════════════════════════════════════
   lib/notion.js — server-side Notion fetch
══════════════════════════════════════════ */

export const FALLBACK_HOTELS = [
  {
    id: '3765d300-73ed-80f8-bda3-cb5e6b9cf3d5',
    name: 'Café Wildschut',
    type: '獨棟民宿',
    dogSize: '小',
    rating: 4,
    price: '100',
    furniture: '可',
    lawn: '無',
    park: '是',
    dogpark: '否',
    restaurant: '是',
    bowl: '是',
    dogBed: '否',
    dogBath: '否',
    sitter: '否',
    sensitive: '否',
    dogArea: '否',
    address: 'https://www.google.com/maps/place/Café+Wildschut/@52.3503202,4.8845877,16.04z',
    website: '',
    photos: [],
  },
  {
    id: '3765d300-73ed-804c-be50-c0e134acdbd0',
    name: 'Hotel2',
    type: '營區',
    dogSize: '大、中、小',
    rating: 5,
    price: '免費',
    furniture: '否',
    lawn: '有',
    park: '是',
    dogpark: '是',
    restaurant: '是',
    bowl: '是',
    dogBed: '否',
    dogBath: '否',
    sitter: '否',
    sensitive: '否',
    dogArea: '是',
    address: 'https://www.google.com/maps/search/butcher+pork/@52.3570274,4.9047794',
    website: '',
    photos: [],
  },
  {
    id: '3765d300-73ed-8090-8b44-ec8fc501c682',
    name: 'Hote3',
    type: '',
    dogSize: '大、中、小',
    rating: 0,
    price: '免費',
    furniture: '',
    lawn: '',
    park: '',
    dogpark: '',
    restaurant: '',
    bowl: '',
    dogBed: '',
    dogBath: '',
    sitter: '',
    sensitive: '',
    dogArea: '',
    address: '',
    website: '',
    photos: [],
  },
];

/**
 * Map raw Notion page properties → clean hotel object.
 * "Images (URL array)" contains file:// encoded Google Drive URLs —
 * we decode and store for display later.
 */
function mapPage(page) {
  const p = page.properties || page; // handle both raw and pre-parsed

  function decode(fileUrl) {
    try {
      const json = JSON.parse(decodeURIComponent(fileUrl.replace('file://', '')));
      return json.source || null;
    } catch { return null; }
  }

  const rawImages = Array.isArray(p['Images (URL array)']) ? p['Images (URL array)'] : [];
  const photos = rawImages.map(decode).filter(Boolean);

  // Extract clean address (strip markdown link syntax)
  let address = p['地址'] || '';
  const urlMatch = address.match(/\(([^)]+)\)/);
  if (urlMatch) address = urlMatch[1];

  return {
    id: p.id || p.url?.split('/').pop()?.replace(/[^a-f0-9]/g, '').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5') || String(Date.now()),
    name: (p['旅宿業者'] || '').replace(/\*\*/g, '').trim(),
    type: p['物件類型'] || '',
    dogSize: p['接受狗狗大小'] || '',
    rating: Number(p['狗狗友善評分等級']) || 0,
    price: p['狗狗費用'] || '',
    furniture: p['可以上家具(沙發、床)'] || '',
    lawn: p['園內有狗狗草地區'] || '',
    park: p['附近有公園'] || '',
    dogpark: p['附近有狗狗公園'] || '',
    restaurant: p['可以到餐廳區'] || '',
    bowl: p['提供水碗'] || '',
    dogBed: p['提供狗狗床鋪'] || '',
    dogBath: p['狗狗淋浴設施'] || '',
    sitter: p['附設狗狗保姆服務'] || '',
    sensitive: p['高敏狗狗首選'] || '',
    dogArea: p['狗狗在是否能在全區落地'] || '',
    address,
    website: p['網頁'] || '',
    photos,
  };
}

export async function fetchHotels() {
  const PAGE_IDS = [
    '3765d300-73ed-80f8-bda3-cb5e6b9cf3d5', // Café Wildschut
    '3765d300-73ed-804c-be50-c0e134acdbd0', // Hotel2
    '3765d300-73ed-8090-8b44-ec8fc501c682', // Hote3
  ];

  const SYSTEM = `You are a data assistant. Use the Notion MCP tool to fetch hotel data.
For each of these page IDs, call notion-fetch:
${PAGE_IDS.map((id, i) => `${i + 1}. ${id}`).join('\n')}

After fetching all pages, return ONLY a valid JSON array (no markdown) with this schema per hotel:
[{"id":"page_id","name":"旅宿業者 value","type":"物件類型","dogSize":"接受狗狗大小","rating":0,
"price":"狗狗費用","furniture":"可以上家具(沙發、床)","lawn":"園內有狗狗草地區","park":"附近有公園",
"dogpark":"附近有狗狗公園","restaurant":"可以到餐廳區","bowl":"提供水碗","dogBed":"提供狗狗床鋪",
"dogBath":"狗狗淋浴設施","sitter":"附設狗狗保姆服務","sensitive":"高敏狗狗首選",
"dogArea":"狗狗在是否能在全區落地","address":"地址 field as-is","website":"網頁",
"photos":["decoded source URLs from Images (URL array) — decode each file:// URL and extract the source field"]}]
Return raw JSON array only. No explanation.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 6000,
        system: SYSTEM,
        messages: [{ role: 'user', content: 'Fetch all hotel pages and return JSON array.' }],
        mcp_servers: [{ type: 'url', url: 'https://mcp.notion.com/mcp', name: 'notion' }],
      }),
    });
    const data = await res.json();

    let text = '';
    for (let i = data.content.length - 1; i >= 0; i--) {
      const blk = data.content[i];
      if (blk.type === 'text' && blk.text?.includes('[')) { text = blk.text; break; }
    }
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const s = text.indexOf('['), e = text.lastIndexOf(']');
    if (s >= 0 && e > s) text = text.slice(s, e + 1);

    const hotels = JSON.parse(text);
    // Normalise: strip markdown bold from name, ensure arrays
    return hotels.map(h => ({
      ...h,
      name: (h.name || '').replace(/\*\*/g, '').trim(),
      photos: Array.isArray(h.photos) ? h.photos.filter(u => u && u.startsWith('http')) : [],
      rating: Number(h.rating) || 0,
    }));
  } catch (err) {
    console.error('[notion] fetchHotels failed:', err);
    return FALLBACK_HOTELS;
  }
}

export async function fetchHotelById(id) {
  const hotels = await fetchHotels();
  return hotels.find(h => h.id === id) || null;
}
