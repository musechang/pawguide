import Link from 'next/link';
import { useFavourites } from '../../lib/hooks';
import PawRating from './PawRating';

const FALLBACK = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=420&fit=crop';

const AMENITY_ICONS = {
  dogArea:    { label:'全區落地', icon:'🐾' },
  lawn:       { label:'附設草皮', icon:'🌿', check:'有' },
  dogpark:    { label:'狗狗公園', icon:'🏃' },
  restaurant: { label:'可至餐廳', icon:'🍽️' },
  bowl:       { label:'提供水碗', icon:'🥣' },
};

export default function HotelCardRow({ hotel }) {
  const { has, toggle } = useFavourites();
  const isFav = has(hotel.id);
  const img = hotel.photos?.[0] || FALLBACK;

  const shownAmenities = Object.entries(AMENITY_ICONS)
    .filter(([key, { check }]) => hotel[key] === (check || '是'))
    .slice(0, 4);

  return (
    <>
      <Link href={`/stays/${hotel.id}`} className="result-card-row">
        {/* Image */}
        <div style={{ position:'relative', borderRadius:12, overflow:'hidden', background:'var(--green-light)', flexShrink:0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img} alt={hotel.name} loading="lazy"
            className="result-card-img"
            onError={e => { e.target.src = FALLBACK; }}
          />
          <button
            style={FAV_BTN}
            onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(hotel.id); }}
            aria-label={isFav ? '取消收藏' : '加入收藏'}
          >
            <span style={{ color: isFav ? '#e53e3e' : 'rgba(255,255,255,.9)', fontSize:16 }}>
              {isFav ? '♥' : '♡'}
            </span>
          </button>
        </div>

        {/* Info */}
        <div style={{ display:'flex', flexDirection:'column', gap:6, minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:700, lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {hotel.name}
              </div>
              <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {hotel.type}
              </div>
            </div>
            <div style={{ flexShrink:0 }}><PawRating rating={hotel.rating} size={12} /></div>
          </div>

          {/* Amenities — hide on xs */}
          <div className="hide-xs" style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {shownAmenities.map(([key, { label, icon }]) => (
              <span key={key} style={{ fontSize:12, color:'var(--text-mid)', display:'flex', alignItems:'center', gap:3 }}>
                {icon} {label}
              </span>
            ))}
          </div>

          {/* Tags + price */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:6, marginTop:'auto' }}>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
              {hotel.dogArea==='是' && <span className="tag tag-green">全區落地</span>}
              {hotel.lawn==='有'    && <span className="tag tag-green">有草地</span>}
              {hotel.park==='是'    && <span className="tag tag-green">近公園</span>}
            </div>
            <div>
              {hotel.price && hotel.price!=='無' && hotel.price!=='免費' && hotel.price!==''
                ? <><strong style={{ fontSize:15, color:'var(--green-dark)' }}>${hotel.price}</strong><span style={{ fontSize:11, color:'var(--text-light)' }}>/晚</span></>
                : <span style={{ fontSize:12, color:'var(--text-light)' }}>無額外寵物費</span>
              }
            </div>
          </div>
        </div>
      </Link>

      {/* Responsive overrides via <style> */}
      <style>{`
        @media (max-width: 375px) {
          .hide-xs { display: none !important; }
        }
      `}</style>
    </>
  );
}

const FAV_BTN = {
  position:'absolute', top:8, right:8,
  background:'rgba(0,0,0,.35)', border:'none', borderRadius:'50%',
  width:28, height:28, cursor:'pointer',
  display:'flex', alignItems:'center', justifyContent:'center',
  backdropFilter:'blur(4px)',
};
