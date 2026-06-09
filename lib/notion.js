/*
  lib/notion.js
  Fetches hotel data from Notion via Anthropic API + Notion MCP.
  地址欄位保留原始 Google Maps URL 供 MapThumbnail 使用。
  Images (URL array) 的 file:// 解碼後取 source (Google Drive URL)。
*/

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
    address: 'https://www.google.com/maps/place/Caf%C3%A9+Wildschut/@52.3534218,4.8822933,16z',
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
    address: 'https://www.google.com/maps/search/butcher+pork/@52.3570274,4.9047794,15z',
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

/* Decode a Notion file:// URL → extract the source field */
function decodeFileUrl(raw) {
  try {
    const json = JSON.parse(decodeURIComponent(raw.replace('file://', '')));
    return json.source || null;
  } catch { return null; }
}

/* Strip markdown link syntax [text](url) → url */
function extractUrl(str) {
  if (!str) return '';
  const m = str.match(/\(([^)]+)\)\s*$/);
  if (m) return m[1];
  return str;
}

/* Normalise a raw hotel object from Claude's JSON output */
function normalise(h) {
  // Decode photos: each entry may be a file:// URL or already an https:// URL
  const photos = (Array.isArray(h.photos) ? h.photos : [])
    .map(p => {
      if (!p) return null;
      if (p.startsWith('http')) return p;
      if (p.startsWith('file://')) return decodeFileUrl(p);
      return null;
    })
    .filter(Boolean);

  // Address: strip markdown link wrapper, keep the raw URL
  const address = extractUrl(h.address || '');

  return {
    ...h,
    name: (h.name || '').replace(/\*\*/g, '').trim(),
    address,
    photos,
    rating: Number(h.rating) || 0,
  };
}

export async function fetchHotels() {
  const PAGE_IDS = [
    '3765d300-73ed-80f8-bda3-cb5e6b9cf3d5',
    '3765d300-73ed-804c-be50-c0e134acdbd0',
    '3765d300-73ed-8090-8b44-ec8fc501c682',
  ];

  const SYSTEM = `You are a data assistant. Use the Notion MCP tool.

STEP 1: For each of these Notion page IDs, call notion-fetch with that ID:
${PAGE_IDS.join('\n')}

STEP 2: From each page's properties, extract EVERY field exactly as stored.
For the "Images (URL array)" field: it contains an array of file:// encoded URLs.
Decode each file:// URL (URL-decode the JSON string) and extract the "source" field from the decoded JSON object.
Include these decoded source values in the photos array.

STEP 3: Return ONLY a raw JSON array with no markdown fences. Schema:
[{
  "id": "<the page UUID with dashes>",
  "name": "<旅宿業者 — strip any ** markdown>",
  "type": "<物件類型>",
  "dogSize": "<接受狗狗大小>",
  "rating": <狗狗友善評分等級 as number, 0 if empty>,
  "price": "<狗狗費用>",
  "furniture": "<可以上家具(沙發、床)>",
  "lawn": "<園內有狗狗草地區>",
  "park": "<附近有公園>",
  "dogpark": "<附近有狗狗公園>",
  "restaurant": "<可以到餐廳區>",
  "bowl": "<提供水碗>",
  "dogBed": "<提供狗狗床鋪>",
  "dogBath": "<狗狗淋浴設施>",
  "sitter": "<附設狗狗保姆服務>",
  "sensitive": "<高敏狗狗首選>",
  "dogArea": "<狗狗在是否能在全區落地>",
  "address": "<地址 field EXACTLY as stored — keep full URL if it is a URL>",
  "website": "<網頁>",
  "photos": ["<decoded source value from each Images file:// entry>"]
}]`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: SYSTEM,
        messages: [{ role: 'user', content: 'Fetch all 3 hotel pages and return the JSON array now.' }],
        mcp_servers: [{ type: 'url', url: 'https://mcp.notion.com/mcp', name: 'notion' }],
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    // Find the last text block that contains a JSON array
    let text = '';
    for (let i = data.content.length - 1; i >= 0; i--) {
      const blk = data.content[i];
      if (blk.type === 'text' && blk.text?.includes('[')) { text = blk.text; break; }
    }
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const s = text.indexOf('['), e = text.lastIndexOf(']');
    if (s < 0 || e <= s) throw new Error('No JSON array in response');

    const raw = JSON.parse(text.slice(s, e + 1));
    return raw.map(normalise);
  } catch (err) {
    console.error('[notion] fetchHotels failed:', err.message);
    return FALLBACK_HOTELS;
  }
}

export async function fetchHotelById(id) {
  const hotels = await fetchHotels();
  return hotels.find(h => h.id === id) || null;
}
