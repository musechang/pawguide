/*
  MapThumbnail.js
  - address 欄位若是 Google Maps URL → 解析 lat/lon → OSM tile 圖
  - address 是文字 → Nominatim geocode → OSM tile 圖
  - 點擊後若有 Google Maps URL 直接跳轉，否則用座標開 Google Maps
  - 使用 OSM tile server（完全免費，無需 API key）
*/
import { useState, useEffect } from 'react';

/* Extract lat/lon from a Google Maps URL */
function extractCoords(url) {
  if (!url) return null;
  let m = url.match(/@([-\d.]+),([-\d.]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = url.match(/!3d([-\d.]+)!4d([-\d.]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  // /search/ URL format: /search/name/@lat,lon,zoom
  m = url.match(/\/search\/[^@]*@([-\d.]+),([-\d.]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  return null;
}

/* Nominatim geocode */
async function geocode(query) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': 'PawGuide/1.0', 'Accept-Language': 'zh-TW,zh,en' } }
    );
    const d = await r.json();
    if (d?.[0]) return { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon) };
  } catch {}
  return null;
}

/*
  Build an OSM tile-based static map image.
  Uses leaflet-based staticmap from maps.geoapify.com (free tier: 3000 req/day).
  Falls back to a hand-crafted tile URL if that fails.
*/
function osmTileUrl(lat, lon) {
  const zoom = 15;
  // Tile coordinates
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom));
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

/* Use embed iframe URL from openstreetmap.org for a reliable static view */
function osmEmbedUrl(lat, lon) {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.005},${lat - 0.003},${lon + 0.005},${lat + 0.003}&layer=mapnik&marker=${lat},${lon}`;
}

export default function MapThumbnail({ name, address }) {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');

      // 1. Extract from Google Maps URL
      if (address?.startsWith('http')) {
        const c = extractCoords(address);
        if (c && !cancelled) { setCoords(c); setStatus('ready'); return; }
      }

      // 2. Geocode text address or hotel name
      const q = (address && !address.startsWith('http')) ? `${name} ${address}` : name;
      if (q?.trim()) {
        const c = await geocode(q.trim());
        if (!cancelled) {
          if (c) { setCoords(c); setStatus('ready'); }
          else setStatus('error');
        }
      } else {
        if (!cancelled) setStatus('error');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [name, address]);

  // Click destination: prefer original Google Maps URL, else build one from coords
  const clickUrl = address?.startsWith('http')
    ? address
    : coords
      ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}`
      : `https://www.google.com/maps/search/${encodeURIComponent(name)}`;

  return (
    <a href={clickUrl} target="_blank" rel="noopener noreferrer" style={WRAP}>
      {status === 'loading' && (
        <Center><div style={SPIN_STYLE} /><span style={HINT}>地圖載入中…</span></Center>
      )}

      {status === 'ready' && coords && (
        /* Use OSM iframe embed — most reliable, no CORS, always works */
        <>
          <iframe
            title={`${name} 地圖`}
            src={osmEmbedUrl(coords.lat, coords.lon)}
            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            loading="lazy"
          />
          <div style={OVERLAY}>
            <span>📍</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-dark)' }}>
              在 Google Maps 查看
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-light)' }}>↗</span>
          </div>
        </>
      )}

      {status === 'error' && (
        <Center>
          <span style={{ fontSize: 28 }}>📍</span>
          <span style={{ fontWeight: 600, color: 'var(--green-dark)', fontSize: 13 }}>查看地圖</span>
          <span style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'center', maxWidth: 180 }}>{name}</span>
        </Center>
      )}
    </a>
  );
}

function Center({ children }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}>
      {children}
    </div>
  );
}

const WRAP = {
  display: 'block', position: 'relative', height: 200,
  borderRadius: 12, overflow: 'hidden',
  background: 'var(--green-light)', textDecoration: 'none', cursor: 'pointer',
};
const OVERLAY = {
  position: 'absolute', bottom: 0, left: 0, right: 0,
  background: 'rgba(255,255,255,.90)', backdropFilter: 'blur(4px)',
  padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
};
const HINT = { fontSize: 12, color: 'var(--text-light)' };
const SPIN_STYLE = {
  width: 24, height: 24,
  border: '3px solid var(--green-light)',
  borderTopColor: 'var(--green-dark)',
  borderRadius: '50%',
  animation: 'spin .8s linear infinite',
};
