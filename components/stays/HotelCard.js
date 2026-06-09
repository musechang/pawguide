import Link from 'next/link';
import { useFavourites } from '../../lib/hooks';

const FALLBACK = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=420&fit=crop';

export default function HotelCard({ hotel, index = 0 }) {
  const { has, toggle } = useFavourites();
  const isFav = has(hotel.id);
  const img = (hotel.photos?.[0]) || FALLBACK;

  return (
    <Link href={`/stays/${hotel.id}`} style={CARD}>
      {/* Image */}
      <div style={IMG_WRAP}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img} alt={hotel.name} loading="lazy"
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => { e.target.src = FALLBACK; }}
        />
        <button
          style={{ ...FAV_BTN, color: isFav ? '#e53e3e' : 'rgba(255,255,255,.8)' }}
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(hotel.id); }}
          aria-label={isFav ? '取消收藏' : '加入收藏'}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>

      {/* Body */}
      <div style={BODY}>
        <div style={TOP}>
          <div style={NAME}>{hotel.name}</div>
          <div style={RATING}>🐾 {hotel.rating}</div>
        </div>
        <div style={LOC}>{hotel.address?.startsWith("http") ? "" : hotel.address}{hotel.address && !hotel.address.startsWith("http") && hotel.type ? " · " : ""}{hotel.type}</div>
        <div style={TAGS}>
          {hotel.dogArea === '是' && <span className="tag tag-green">全區落地</span>}
          {hotel.lawn   === '有' && <span className="tag tag-green">有草地</span>}
          {hotel.dogpark === '是' && <span className="tag tag-green">狗公園</span>}
          <span className="tag tag-type">{hotel.type}</span>
        </div>
        <div style={PRICE}>
          {hotel.price && hotel.price !== '無' && hotel.price !== '免費' && hotel.price !== ''
            ? <><strong>${hotel.price}</strong><span style={{ fontSize:11,color:'var(--text-light)' }}>/晚（寵物費）</span></>
            : <span style={{ fontSize:12,color:'var(--text-light)' }}>無額外寵物費</span>
          }
        </div>
      </div>
    </Link>
  );
}

const CARD     = { background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden', display:'block', transition:'transform .2s, box-shadow .2s', textDecoration:'none', color:'inherit' };
const IMG_WRAP = { position:'relative', height:180, background:'var(--green-light)', overflow:'hidden' };
const FAV_BTN  = { position:'absolute', top:10, right:10, background:'rgba(0,0,0,.3)', border:'none', borderRadius:'50%', width:32, height:32, fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' };
const BODY  = { padding:12 };
const TOP   = { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4, gap:8 };
const NAME  = { fontSize:14, fontWeight:700, lineHeight:1.3 };
const RATING= { fontSize:12, fontWeight:600, flexShrink:0 };
const LOC   = { fontSize:12, color:'var(--text-light)', marginBottom:6 };
const TAGS  = { display:'flex', flexWrap:'wrap', gap:3, marginBottom:6 };
const PRICE = { fontSize:13 };
