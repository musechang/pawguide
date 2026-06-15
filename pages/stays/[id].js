import Layout from '../../components/layout/Layout';
import PhotoGallery from '../../components/stays/PhotoGallery';
import AmenityGrid from '../../components/stays/AmenityGrid';
import ReviewSection from '../../components/stays/ReviewSection';
import MapThumbnail from '../../components/stays/MapThumbnail';
import PawRating from '../../components/stays/PawRating';
import { useFavourites } from '../../lib/hooks';
import { FALLBACK_HOTELS } from '../../lib/notion';
import Link from 'next/link';

export default function StayDetailPage({ hotel }) {
  const { has, toggle } = useFavourites();
  if (!hotel) return <div style={{ padding:48, textAlign:'center' }}>找不到此住宿</div>;

  const isFav = has(hotel.id);
  const priceLabel = (hotel.price && hotel.price !== '無' && hotel.price !== '免費' && hotel.price !== '')
    ? `$${hotel.price} / 晚（寵物費）`
    : '無額外寵物費';

  return (
    <div className="detail-page">
      <Link href="/stays" style={S.back}>← 返回列表</Link>

      <div className="detail-grid">
        {/* ────── LEFT col ────── */}
        <div>
          <PhotoGallery photos={hotel.photos || []} name={hotel.name} />

          <h2 style={S.subtitle}>關於這個地方</h2>
          <p style={S.desc}>
            {hotel.name}是一間{hotel.type || '旅宿'}，接受{hotel.dogSize || '各種大小'}的狗狗入住。
            {hotel.dogArea === '是' && '狗狗可在全區自由落地，享受無拘束的旅行體驗。'}
            {hotel.lawn === '有' && '園區附設狗狗專屬草皮，讓毛孩盡情奔跑。'}
            歡迎帶著您的毛孩一起入住！
          </p>

          <h2 style={S.subtitle}>寵物友善設施</h2>
          <AmenityGrid hotel={hotel} />

          <ReviewSection hotelId={hotel.id} />
        </div>

        {/* ────── RIGHT col (booking panel) ────── */}
        <div>
          <div className="detail-panel">
            {/* Name + meta */}
            <h1 style={S.hotelName}>{hotel.name}</h1>
            <div style={S.hotelSub}>{hotel.type}{hotel.type && hotel.address ? ' · ' : ''}{hotel.address}</div>

            {/* Official PawGuide rating */}
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <PawRating rating={hotel.rating} size={18} />
              <span style={{ fontSize:12, color:'var(--text-light)' }}>PawGuide 官方評分</span>
            </div>

            {/* Price */}
            <div style={S.price}>{priceLabel}</div>

            {/* Dog size */}
            <div style={S.infoRow}>
              <span style={{ color:'var(--text-mid)' }}>接受狗狗大小：</span>
              <strong>{hotel.dogSize || '不限'}</strong>
            </div>

            {/* Booking.com */}
            {hotel.bookingUrl && (
              <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer" style={S.bookingBtn}>
                🏨 在 Booking.com 查看與預訂
              </a>
            )}

            {/* Website */}
            {hotel.website?.startsWith('http') && (
              <a href={hotel.website} target="_blank" rel="noopener noreferrer" style={S.websiteLink}>
                🔗 查看官方網頁
              </a>
            )}

            {/* Actions */}
            <button style={S.enquiryBtn} onClick={() => alert('預訂功能即將上線！')}>立即詢問</button>
            <button
              style={{ ...S.favBtn, ...(isFav ? S.favOn : {}) }}
              onClick={() => toggle(hotel.id)}
            >
              {isFav ? '♥ 已收藏' : '♡ 加入收藏'}
            </button>

            {/* ── OpenStreetMap thumbnail ── */}
            <MapThumbnail name={hotel.name} address={hotel.address} googleMapUrl={hotel.googleMapUrl} />
          </div>
        </div>
      </div>

      {/* Mobile: booking panel floats at bottom */}
      <style>{`
        /* ── Stays list RWD ── */
        .stays-page { padding-left: var(--px); padding-right: var(--px); }

        /* ── Detail grid ── */
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          .detail-panel {
            position: static !important;
            border-top: 1px solid var(--border);
            padding-top: 24px;
            margin-top: 8px;
          }
        }

        /* ── Result card row ── */
        @media (max-width: 640px) {
          .result-card-row {
            grid-template-columns: 100px 1fr !important;
            gap: 10px !important;
            padding: 12px 0 !important;
          }
        }
        @media (max-width: 375px) {
          .result-card-row {
            grid-template-columns: 1fr !important;
          }
          .result-card-img {
            height: 160px !important;
            border-radius: 10px !important;
          }
        }

        /* ── Stays topbar on mobile ── */
        @media (max-width: 640px) {
          .stays-topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .stays-topbar > div:last-child { width: 100%; justify-content: space-between; }
        }

        /* ── Amenity grid ── */
        @media (max-width: 375px) {
          .amenity-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

StayDetailPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  try {
    const { fetchHotels } = await import('../../lib/notion');
    const hotels = await fetchHotels();
    return { paths: hotels.map(h => ({ params: { id: h.id } })), fallback: 'blocking' };
  } catch {
    return { paths: FALLBACK_HOTELS.map(h => ({ params: { id: h.id } })), fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const { fetchHotels } = await import('../../lib/notion');
    const hotels = await fetchHotels();
    const hotel = hotels.find(h => h.id === params.id) || null;
    return { props: { hotel }, revalidate: 1800 };
  } catch {
    return {
      props: { hotel: FALLBACK_HOTELS.find(h => h.id === params.id) || null },
      revalidate: 1800,
    };
  }
}

/* Styles */
const S = {
  back:       { display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--green-dark)', marginBottom:20, textDecoration:'none' },
  subtitle:   { fontFamily:'Noto Serif TC,serif', fontSize:18, fontWeight:700, margin:'28px 0 12px' },
  desc:       { fontSize:13, color:'var(--text-mid)', lineHeight:1.9, marginBottom:8 },
  hotelName:  { fontFamily:'Noto Serif TC,serif', fontSize:24, fontWeight:700, lineHeight:1.3 },
  hotelSub:   { fontSize:13, color:'var(--text-mid)' },
  price:      { fontSize:22, fontWeight:700, color:'var(--green-dark)' },
  infoRow:    { display:'flex', gap:4, alignItems:'center', fontSize:13, flexWrap:'wrap' },
  bookingBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:12, background:'#003580', color:'white', borderRadius:10, fontSize:13, fontWeight:600, textDecoration:'none' },
  websiteLink:{ display:'block', textAlign:'center', fontSize:12, color:'var(--green-dark)', padding:'6px 0' },
  enquiryBtn: { padding:13, background:'var(--green-dark)', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', width:'100%' },
  favBtn:     { padding:11, background:'var(--white)', color:'var(--text-dark)', border:'1.5px solid var(--border)', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', width:'100%' },
  favOn:      { background:'#FFF0F0', borderColor:'#e53e3e', color:'#e53e3e' },
};
