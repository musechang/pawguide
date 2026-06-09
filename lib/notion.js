/*
  lib/notion.js

  重要說明：
  Notion MCP token 只在 Claude.ai 環境有效，無法在 Vercel server 端使用。
  因此改為：
  1. FALLBACK_HOTELS 直接存放從 Notion 讀到的最新資料（每次手動更新這裡）
  2. fetchHotels() 在 Vercel 上直接回傳 FALLBACK_HOTELS
  3. 需要更新資料時，在 Claude.ai 重新生成這個檔案並上傳 GitHub
*/

export const FALLBACK_HOTELS = [
  {
    id: '3765d300-73ed-80f8-bda3-cb5e6b9cf3d5',
    name: '裕元花園酒店 Windsor Hotel',
    type: '獨棟民宿',
    dogSize: '小',
    rating: 2,
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
    address: '407003台灣臺中市西屯區福安里台灣大道四段610號',
    googleMapUrl: 'https://www.google.com/maps/place/裕元花園酒店+Windsor+Hotel/@24.1796151,120.6213354,17z',
    website: '',
    photos: [],
  },
  {
    id: '3765d300-73ed-804c-be50-c0e134acdbd0',
    name: '台中金典酒店',
    type: '飯店',
    dogSize: '大、中、小',
    rating: 3,
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
    address: '403台灣臺中市西區育德里健行路1049號',
    googleMapUrl: 'https://www.google.com/maps/place/台中金典酒店(五星級飯店)+The+Splendor+Hotel-Taichung/@24.1560596,120.6582129,17z',
    website: '',
    photos: [],
  },
  {
    id: '3765d300-73ed-8090-8b44-ec8fc501c682',
    name: 'Hote3',
    type: '營區',
    dogSize: '大、中、小',
    rating: 1,
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
    googleMapUrl: '',
    website: '',
    photos: [],
  },
];

export async function fetchHotels() {
  // Vercel server 端無法使用 Notion MCP，直接回傳最新靜態資料
  return FALLBACK_HOTELS;
}

export async function fetchHotelById(id) {
  return FALLBACK_HOTELS.find(h => h.id === id) || null;
}
