/**
 * PawGuide — Notion API 整合
 * lib/notion.js
 *
 * 環境變數（在 Vercel / .env.local 設定）：
 *   NOTION_API_KEY       = secret_xxxxxxxxxxxxxxxx
 *   NOTION_DATABASE_ID   = 3765d30073ed809e88ddc0d1df4f1dea
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const headers = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

// ─────────────────────────────────────────────────────────────
// 1. 取得所有「上架中」旅宿（首頁列表用）
// ─────────────────────────────────────────────────────────────
export async function getPublishedStays() {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        filter: {
          property: "網頁顯示狀態",
          select: {
            equals: "✅ 上架中",
          },
        },
        sorts: [
          {
            property: "申請日期",
            direction: "descending",
          },
        ],
      }),
      next: { revalidate: 60 }, // Next.js ISR：每 60 秒重新驗證
    }
  );

  if (!res.ok) {
    throw new Error(`Notion API error: ${res.status}`);
  }

  const data = await res.json();
  return data.results.map(formatStay);
}

// ─────────────────────────────────────────────────────────────
// 2. 取得單一旅宿（詳細頁用）
// ─────────────────────────────────────────────────────────────
export async function getStayById(pageId) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Notion API error: ${res.status}`);
  }

  const page = await res.json();

  // 確認該頁面是「上架中」才回傳，否則回傳 null（顯示 404）
  const status = page.properties["網頁顯示狀態"]?.select?.name;
  if (status !== "✅ 上架中") return null;

  return formatStay(page);
}

// ─────────────────────────────────────────────────────────────
// 3. 依狗狗大小篩選
// ─────────────────────────────────────────────────────────────
export async function getStaysByDogSize(size) {
  // size: "小型犬" | "中型犬" | "大型犬"
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        filter: {
          and: [
            {
              property: "網頁顯示狀態",
              select: { equals: "✅ 上架中" },
            },
            {
              property: "接受狗狗大小",
              rich_text: { contains: size },
            },
          ],
        },
      }),
      next: { revalidate: 60 },
    }
  );

  const data = await res.json();
  return data.results.map(formatStay);
}

// ─────────────────────────────────────────────────────────────
// 4. 格式化 Notion 頁面 → 網站用物件
// ─────────────────────────────────────────────────────────────
function formatStay(page) {
  const p = page.properties;

  return {
    id: page.id,
    // 基本資訊
    name: p["旅宿業者"]?.title?.[0]?.plain_text ?? "",
    address: p["Address"]?.rich_text?.[0]?.plain_text ?? "",
    googleMap: p["Google map"]?.url ?? "",
    type: p["物件類型"]?.rich_text?.[0]?.plain_text ?? "",
    description: p["旅宿特色介紹"]?.rich_text?.[0]?.plain_text ?? "",
    rating: p["狗狗友善評分等級"]?.number ?? null,

    // 寵物政策
    acceptedSizes: p["接受狗狗大小"]?.rich_text?.[0]?.plain_text ?? "",
    extraFeeType: p["額外收取寵物費用"]?.select?.name ?? "",
    extraFeeAmount: p["每晚每隻費用（元）"]?.number ?? null,
    dogFee: p["狗狗費用"]?.rich_text?.[0]?.plain_text ?? "",

    // 設施（是/否）
    roamFree: p["狗狗在是否能在全區落地"]?.rich_text?.[0]?.plain_text ?? "",
    onFurniture: p["可以上家具(沙發、床)"]?.rich_text?.[0]?.plain_text ?? "",
    atRestaurant: p["可以到餐廳區"]?.rich_text?.[0]?.plain_text ?? "",
    aloneInRoom: p["狗狗可單獨留房"]?.select?.name ?? "",
    waterBowl: p["提供水碗"]?.rich_text?.[0]?.plain_text ?? "",
    dogBed: p["提供狗狗床鋪"]?.rich_text?.[0]?.plain_text ?? "",
    grassArea: p["園內有狗狗草地區"]?.rich_text?.[0]?.plain_text ?? "",
    dogShower: p["狗狗淋浴設施"]?.rich_text?.[0]?.plain_text ?? "",
    sensitiveDog: p["高敏狗狗首選"]?.rich_text?.[0]?.plain_text ?? "",
    nannyService: p["附設狗狗保姆服務"]?.rich_text?.[0]?.plain_text ?? "",
    walkService: p["附設遛狗服務"]?.select?.name ?? "",

    // 周邊
    nearPark: p["附近有公園"]?.rich_text?.[0]?.plain_text ?? "",
    nearDogPark: p["附近有狗狗公園"]?.rich_text?.[0]?.plain_text ?? "",
    nearbySpots: p["推薦周邊景點/餐廳"]?.rich_text?.[0]?.plain_text ?? "",

    // 評鑑大使
    ambassadorWilling: p["毛孩評鑑大使合作意願"]?.select?.name ?? "",

    // 狀態
    publishStatus: p["網頁顯示狀態"]?.select?.name ?? "",
    reviewStatus: p["審核狀態"]?.select?.name ?? "",
  };
}
