/* ══════════════════════════════════════════
   MapThumbnail.js
   - 從 Notion address 欄位解析座標或文字地址
   - 用 Google Maps Static API 顯示靜態地圖縮圖
     （免費方案：每月 $200 免費額度，夠一般用量）
   - 點擊導流到 Google Maps
   - 若 NEXT_PUBLIC_GOOGLE_MAPS_KEY 未設定，
     fallback 到 OpenStreetMap staticmap
══════════════════════════════════════════ */
import { useState, useEffect } from 'react';

function extractCoordsFromUrl(url) {
  if (!url) return null;
  // Google Maps URL formats: @lat,lon or /place/.../...!3dlat!4dlon
  let m = url.match(/@([-\d.]+),([-\d.]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = url.match(/!3d([-\d.]+)!4d([-\d.]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  return null;
}

async function geocodeNominatim(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'zh-TW,zh,en' } });
    const data = await res.json();
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

function buildMapImgUrl(lat, lon, w = 400, h = 200) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (apiKey) {
    // Google Maps Static API
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=15&size=${w}x${h}&maptype=roadmap&markers=color:0x1C3C2A%7C${lat},${lon}&key=${apiKey}`;
  }
  // Fallback: OpenStreetMap static map (no key required)
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=15&size=${w}x${h}&markers=${lat},${lon},red`;
}

function buildGoogleMapsUrl(lat, lon, name) {
  if (lat && lon) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }
  return `https://www.google.com/maps/search/${encodeURIComponent(name)}`;
}

export default function MapThumbnail({ name, address }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setImgError(false);

      // 1. address 是 Google Maps URL → extract coords directly
      if (address?.startsWith('http')) {
        const c = extractCoordsFromUrl(address);
        if (c && !cancelled) { setCoords(c); setLoading(false); return; }
      }

      // 2. address 是文字或 name → geocode via Nominatim
      const query = address && !address.startsWith('http')
        ? `${name} ${address}`.trim()
        : name;
      if (query) {
        const c = await geocodeNominatim(query);
        if (!cancelled) { setCoords(c); }
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [name, address]);

  const googleMapsUrl = buildGoogleMapsUrl(coords?.lat, coords?.lon, name);
  const mapImgUrl = coords ? buildMapImgUrl(coords.lat, coords.lon) : null;

  // Clean display address
  const displayAddr = address?.startsWith('http') ? '' : address || '';

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={WRAP}
      aria-label={`在 Google Maps 查看 ${name}`}
    >
      {loading ? (
        <Placeholder icon="⏳" text="地圖載入中…" />
      ) : coords && !imgError ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mapImgUrl}
            alt={`${name} 地圖`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setImgError(true)}
          />
          <div style={OVERLAY}>
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-dark)' }}>
              在 Google Maps 查看
            </span>
          </div>
        </>
      ) : (
        <Placeholder icon="📍" text="查看地圖" sub={displayAddr || name} />
      )}
    </a>
  );
}

function Placeholder({ icon, text, sub }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ fontWeight: 600, color: 'var(--green-dark)', fontSize: 13 }}>{text}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'center', maxWidth: 200 }}>{sub}</span>}
    </div>
  );
}

const WRAP    = { display: 'block', position: 'relative', height: 190, borderRadius: 12, overflow: 'hidden', background: 'var(--green-light)', textDecoration: 'none', cursor: 'pointer' };
const OVERLAY = { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(4px)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 };
