import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import HotelCard from '../components/stays/HotelCard';
import SearchPopup from '../components/search/SearchPopup';
import { useSearchDisplay } from '../lib/hooks';
import { FALLBACK_HOTELS } from '../lib/notion';

export default function HomePage({ hotels }) {
  const router = useRouter();
  const { locLabel, guestLabel } = useSearchDisplay();
  const [searchOpen, setSearchOpen] = useState(false);

  const nearby    = hotels.slice(0, 4);
  const largeDog  = hotels.filter(h => h.dogSize?.includes('大')).slice(0, 4);
  // 三顆星：rating >= 3（Notion 評分欄位是數字）
  const topRated  = hotels.filter(h => Number(h.rating) >= 3).slice(0, 4);

  function openSearch() { setSearchOpen(true); }
  function goSearch()   { router.push('/stays'); }

  return (
    <div>
      {/* ── HERO ── */}
      <div className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hero.png"
          alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
          onError={e => e.target.style.display = 'none'}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(250,248,244,.55) 0%,rgba(250,248,244,.30) 35%,rgba(250,248,244,.97) 100%)' }} />

        <h1 className="hero-title">毛孩指南</h1>

        {/* Search bar */}
        <div className="hero-search-wrap">
          <div className="hero-search-bar">
            <button className="hero-search-field" onClick={openSearch}>
              <span style={LBL}>地點</span>
              <span style={VAL}>{locLabel}</span>
            </button>
            <button className="hero-search-field" onClick={openSearch}>
              <span style={LBL}>旅客與毛孩</span>
              <span style={VAL}>{guestLabel}</span>
            </button>
            {/* Search button — fixed circle, no flex-grow */}
            <button
              className="hero-search-btn"
              onClick={goSearch}
              aria-label="搜尋"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 1：台北近郊 ── */}
      <section className="home-section">
        <div className="home-section-hdr">
          <h2 className="home-section-title">台北近郊</h2>
          <a href="/stays" style={SEE_ALL}>查看全部 →</a>
        </div>
        <div className="hotel-grid">
          {nearby.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
        </div>
      </section>

      {/* ── SECTION 2：大型狗友善 ── */}
      <section className="home-section">
        <div className="home-section-hdr">
          <h2 className="home-section-title">大型狗友善</h2>
          <a href="/stays?dogSize=大" style={SEE_ALL}>查看全部 →</a>
        </div>
        <div className="hotel-grid">
          {(largeDog.length ? largeDog : nearby).map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
        </div>
      </section>

      {/* ── SECTION 3：⭐⭐⭐ 絕佳體驗 ── */}
      <section className="home-section" style={{ paddingBottom: 60 }}>
        <div className="home-section-hdr">
          <h2 className="home-section-title">
            <span style={{ marginRight: 6 }}>⭐⭐⭐</span>絕佳體驗
          </h2>
          <a href="/stays" style={SEE_ALL}>查看全部 →</a>
        </div>
        {topRated.length > 0 ? (
          <div className="hotel-grid">
            {topRated.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
          </div>
        ) : (
          <div style={{ padding: '32px 0', color: 'var(--text-light)', fontSize: 14, textAlign: 'center' }}>
            即將推出更多精選住宿 🐾
          </div>
        )}
      </section>

      {searchOpen && (
        <SearchPopup
          onClose={() => setSearchOpen(false)}
          onSearch={() => { setSearchOpen(false); router.push('/stays'); }}
          hideDate
        />
      )}
    </div>
  );
}

HomePage.getLayout = (page) => <Layout hideSearch>{page}</Layout>;

export async function getStaticProps() {
  try {
    const { fetchHotels } = await import('../lib/notion');
    const hotels = await fetchHotels();
    return { props: { hotels }, revalidate: 1800 }; // 每半小時更新
  } catch {
    return { props: { hotels: FALLBACK_HOTELS }, revalidate: 1800 };
  }
}

const LBL     = { fontSize: 10, color: 'var(--text-light)', display: 'block', marginBottom: 3, fontWeight: 600, letterSpacing: '.4px', textTransform: 'uppercase' };
const VAL     = { fontSize: 14, color: 'var(--text-dark)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' };
const SEE_ALL = { fontSize: 13, color: 'var(--green-dark)', fontWeight: 600 };
