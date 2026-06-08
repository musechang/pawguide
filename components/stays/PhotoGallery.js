import { useState } from 'react';

const FALLBACK = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&h=600&fit=crop';

export default function PhotoGallery({ photos = [], name = '' }) {
  const [current, setCurrent] = useState(0);
  const imgs = photos.length ? photos : [FALLBACK];

  return (
    <div>
      <div className="photo-main-wrap" style={{ position:'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgs[current]} alt={name}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
          onError={e => { e.target.src = FALLBACK; }} />
        {imgs.length > 1 && (
          <>
            <button style={{ ...ARROW, left:12 }} onClick={() => setCurrent(i => (i-1+imgs.length)%imgs.length)}>‹</button>
            <button style={{ ...ARROW, right:12 }} onClick={() => setCurrent(i => (i+1)%imgs.length)}>›</button>
            <div style={COUNTER}>{current+1} / {imgs.length}</div>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
          {imgs.slice(0,8).map((u, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={u} alt="" loading="lazy"
              onClick={() => setCurrent(i)}
              style={{ ...THUMB, border: current===i ? '2px solid var(--green-dark)' : '2px solid transparent' }}
              onError={e => { e.target.src = FALLBACK; }} />
          ))}
        </div>
      )}
    </div>
  );
}

const ARROW   = { position:'absolute', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,.85)', border:'none', borderRadius:'50%', width:36, height:36, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)', boxShadow:'0 2px 8px rgba(0,0,0,.15)' };
const COUNTER = { position:'absolute', bottom:12, right:12, background:'rgba(0,0,0,.5)', color:'white', fontSize:12, padding:'4px 10px', borderRadius:20 };
const THUMB   = { width:80, height:58, borderRadius:8, objectFit:'cover', cursor:'pointer', flexShrink:0 };
