/**
 * PawGuide — lib/notion.js
 *
 * 環境變數（Vercel / .env.local）：
 *   NOTION_API_KEY      = secret_xxxxxxxx
 *   NOTION_DATABASE_ID  = 3765d30073ed809e88ddc0d1df4f1dea
 */

const NOTION_API_KEY  = process.env.NOTION_API_KEY;
const DATABASE_ID     = process.env.NOTION_DATABASE_ID;

const headers = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
};

// ─────────────────────────────────────────────────────────────
// fetchHotels — 給 pages/stays/index.js 和 [id].js 用
// 只抓「✅ 上架中」的旅宿
// ─────────────────────────────────────────────────────────────
export async function fetchHotels() {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filter: {
          property: '網頁顯示狀態',
          select: { equals: '✅ 上架中' },
        },
        sorts: [{ property: '申請日期', direction: 'descending' }],
      }),
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error(`Notion API error: ${res.status}`);

  const data = await res.json();
  return data.results.map(formatHotel);
}

// ─────────────────────────────────────────────────────────────
// 格式化 Notion 頁面 → 現有頁面使用的欄位名稱
// ─────────────────────────────────────────────────────────────
function formatHotel(page) {
  const p = page.properties;

  const text  = (key) => p[key]?.rich_text?.[0]?.plain_text ?? '';
  const title = (key) => p[key]?.title?.[0]?.plain_text ?? '';
  const sel   = (key) => p[key]?.select?.name ?? '';
  const num   = (key) => p[key]?.number ?? null;
  const url   = (key) => p[key]?.url ?? '';
  const email = (key) => p[key]?.email ?? '';
  const phone = (key) => p[key]?.phone_number ?? '';

  return {
    id:           page.id,

    // 基本資訊
    name:         title('旅宿業者'),
    type:         text('物件類型'),
    address:      text('Address'),
    googleMapUrl: url('Google map'),
    rating:       num('狗狗友善評分等級'),
    description:  text('旅宿特色介紹'),

    // 聯絡資訊
    contactName:  text('聯絡人姓名'),
    contactEmail: email('聯絡 Email'),
    contactPhone: phone('聯絡電話'),

    // 照片（Notion Files 欄位）
    photos: (() => {
      const files = p['Images (URL array)']?.files ?? [];
      return files.map(f => f.file?.url ?? f.external?.url ?? '').filter(Boolean);
    })(),

    // 寵物費用
    price:        text('狗狗費用') || (num('每晚每隻費用（元）') ? String(num('每晚每隻費用（元）')) : ''),
    extraFee:     sel('額外收取寵物費用'),

    // 狗狗政策
    dogSize:      text('接受狗狗大小'),
    dogArea:      text('狗狗在是否能在全區落地'),   // 是/否
    lawn:         text('園內有狗狗草地區'),          // 有/無
    onFurniture:  text('可以上家具(沙發、床)'),
    atRestaurant: text('可以到餐廳區'),
    aloneInRoom:  sel('狗狗可單獨留房'),
    waterBowl:    text('提供水碗'),
    dogBed:       text('提供狗狗床鋪'),
    dogShower:    text('狗狗淋浴設施'),
    sensitiveDog: text('高敏狗狗首選'),
    nannyService: text('附設狗狗保姆服務'),
    walkService:  sel('附設遛狗服務'),

    // 周邊
    nearPark:     text('附近有公園'),
    nearDogPark:  text('附近有狗狗公園'),
    nearbySpots:  text('推薦周邊景點/餐廳'),

    // 評鑑大使
    ambassadorWilling: sel('毛孩評鑑大使合作意願'),

    // 狀態（供內部參考）
    publishStatus: sel('網頁顯示狀態'),
    reviewStatus:  sel('審核狀態'),
  };
}

// ─────────────────────────────────────────────────────────────
// FALLBACK_HOTELS — API 失敗時顯示，避免白頁
// ─────────────────────────────────────────────────────────────
export const FALLBACK_HOTELS = [];
