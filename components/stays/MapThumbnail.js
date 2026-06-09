/*
  MapThumbnail.js
  - googleMapUrl: Notion 的 "Google map" 欄位，直接用來跳轉
  - address: 文字地址，用來 geocode 顯示地圖
  - 地圖顯示：OSM iframe embed（免費，無需 API key）
  - 點擊：跳轉到 googleMapUrl（優先）或 Google Maps 搜尋
*/
import { useState, useEffect } from 'react';

function extractCoordsFromUrl(url) {
  if (!url) return null;
  let m = url.match(/@([-\d.]+),([-\d.]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = url.match(/!3d([-\d.]+)!4d([-\d.]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  return null;
}

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

function osmEmbedUrl(lat, lon) {
  const d = 0.004;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-d},${lat-d*0.7},${lon+d},${lat+d*0.7}&layer=mapnik&marker=${lat},${lon}`;
}

export default function MapThumbnail({ name, address, googleMapUrl }) {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');

      // 1. Try to extract coords from Google Maps URL
      if (googleMapUrl) {
        const c = extractCoordsFromUrl(googleMapUrl);
        if (c && !cancelled) { setCoords(c); setStatus('ready'); return; }
      }

      // 2. Geocode text address
      const q = [name, address].filter(Boolean).join(' ').trim();
      if (q) {
        const c = await geocode(q);
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
  }, [name, address, googleMapUrl]);

  // Click target: Google Maps URL or fallback search
  const clickUrl = googleMapUrl
    || (coords ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}` : null)
    || `https://www.google.com/maps/search/${encodeURIComponent(name)}`;

  return (
    <a href={clickUrl} target="_blank" rel="noopener noreferrer" style={WRAP}>
      {status === 'loading' && (
        <Center><div style={SPIN} /><span style={HINT}>地圖載入中…</span></Center>
      )}
      {status === 'ready' && coords && (
        <>
          <iframe
            title={`${name} 地圖`}
            src={osmEmbedUrl(coords.lat, coords.lon)}
            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            loading="lazy"
          />
          <div style={OVERLAY}>
            <span>📍</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-dark)' }}>在 Google Maps 查看</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-light)' }}>↗</span>
          </div>
        </>
      )}
      {status === 'error' && (
        <Center>
          <span style={{ fontSize: 28 }}>📍</span>
          <span style={{ fontWeight: 600, color: 'var(--green-dark)', fontSize: 13 }}>查看地圖</span>
          {address && <span style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'center' }}>{address}</span>}
        </Center>
      )}
    </a>
  );
}

function Center({ children }) {
  return <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:16 }}>{children}</div>;
}

const WRAP    = { display:'block', position:'relative', height:200, borderRadius:12, overflow:'hidden', background:'var(--green-light)', textDecoration:'none', cursor:'pointer' };
const OVERLAY = { position:'absolute', bottom:0, left:0, right:0, background:'rgba(255,255,255,.90)', backdropFilter:'blur(4px)', padding:'8px 14px', display:'flex', alignItems:'center', gap:8 };
const HINT    = { fontSize:12, color:'var(--text-light)' };
const SPIN    = { width:24, height:24, border:'3px solid var(--green-light)', borderTopColor:'var(--green-dark)', borderRadius:'50%', animation:'spin .8s linear infinite' };
