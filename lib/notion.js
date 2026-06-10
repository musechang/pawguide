/*
  lib/notion.js
  最後更新：2026-06-10
  資料來源：Notion 旅宿業者資訊資料庫
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
    address: '407003 台灣臺中市西屯區福安里台灣大道四段610號',
    googleMapUrl: 'https://www.google.com/maps/place/裕元花園酒店+Windsor+Hotel/@24.1796151,120.6213354,17z/data=!3m1!4b1!4m9!3m8!1s0x34693dc2f231bdd1:0xf9c1ae60e0710bd9!5m2!4m1!1i2!8m2!3d24.1796151!4d120.6239157!16s%2Fg%2F155rypx2?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D',
    website: '',
    photos: [
      'https://raw.githubusercontent.com/musechang/pawguide/refs/heads/main/public/assets/%E8%A3%95%E5%85%83%E8%8A%B1%E5%9C%92%E9%85%92%E5%BA%97%20Windsor%20Hotel/gettyimages-1468540478-612x612.jpg',
      'https://raw.githubusercontent.com/musechang/pawguide/refs/heads/main/public/assets/%E8%A3%95%E5%85%83%E8%8A%B1%E5%9C%92%E9%85%92%E5%BA%97%20Windsor%20Hotel/gettyimages-1261642435-612x612.jpg',
    ],
  },
  {
    id: '3765d300-73ed-804c-be50-c0e134acdbd0',
    name: '台中金典酒店12345',
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
    address: '403 台灣臺中市西區育德里健行路1049號',
    googleMapUrl: 'https://www.google.com/maps/place/台中金典酒店(五星級飯店)+The+Splendor+Hotel-Taichung/@24.1560596,120.6582129,17z/data=!3m1!4b1!4m9!3m8!1s0x34693d9d2a396547:0xbcfaedfa2eb17a15!5m2!4m1!1i2!8m2!3d24.1560597!4d120.6630785!16s%2Fg%2F155rlkqk?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D',
    website: '',
    photos: [
      'https://raw.githubusercontent.com/musechang/pawguide/refs/heads/main/public/assets/%E5%8F%B0%E4%B8%AD%E9%87%91%E5%85%B8%E9%85%92%E5%BA%9712345/gettyimages-1188473929-612x612.jpg',
      'https://raw.githubusercontent.com/musechang/pawguide/refs/heads/main/public/assets/%E5%8F%B0%E4%B8%AD%E9%87%91%E5%85%B8%E9%85%92%E5%BA%9712345/gettyimages-1011212974-612x612.jpg',
    ],
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
  return FALLBACK_HOTELS;
}

export async function fetchHotelById(id) {
  return FALLBACK_HOTELS.find(h => h.id === id) || null;
}
