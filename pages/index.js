import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import HotelCard from '../components/stays/HotelCard';
import SearchPopup from '../components/search/SearchPopup';
import { useSearchDisplay } from '../lib/hooks';
import { FALLBACK_HOTELS } from '../lib/notion';

export default function HomePage({ hotels }) {
  const router = useRouter();
  const { locLabel, guestLabel } = useSearchDisplay();  // 移除 dateLabel
  const [searchOpen, setSearchOpen] = useState(false);

  const nearby   = hotels.slice(0, 4);
  const largeDog = hotels.filter(h => h.dogSize?.includes('大')).slice(0, 4);

  return (
    <div>
      {/* ── HERO ── */}
      <div className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/hero.png" alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
          onError={e => e.target.style.display = 'none'} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(28,60,42,.25) 0%,rgba(28,60,42,.08) 45%,rgba(250,248,244,.96) 100%)' }} />

        <h1 className="hero-title">毛孩指南</h1>

        {/* Search bar — 往下移 56px，日期欄位移除 */}
        <div className="hero-search-wrap" style={{ marginTop: 80 }}>
          <div className="hero-search-bar">
            {/* 地點 */}
            <button className="hero-search-field" onClick={() => setSearchOpen(true)}>
              <span style={LBL}>地點</span>
              <span style={VAL}>{locLabel}</span>
            </button>
            {/* 旅客與毛孩 — 日期欄已移除 */}
            <button className="hero-search-field" onClick={() => setSearchOpen(true)}>
              <span style={LBL}>旅客與毛孩</span>
              <span style={VAL}>{guestLabel}</span>
            </button>
            <button className="hero-search-btn" onClick={() => router.push('/stays')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <section className="home-section">
        <div className="home-section-hdr">
          <h2 className="home-section-title">台北近郊</h2>
          <a href="/stays" style={SEE_ALL}>查看全部 →</a>
        </div>
        <div className="hotel-grid">
          {nearby.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
        </div>
      </section>

      <section className="home-section" style={{ paddingBottom: 60 }}>
        <div className="home-section-hdr">
          <h2 className="home-section-title">大型狗友善</h2>
          <a href="/stays?dogSize=大" style={SEE_ALL}>查看全部 →</a>
        </div>
        <div className="hotel-grid">
          {(largeDog.length ? largeDog : nearby).map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
        </div>
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
    return { props: { hotels }, revalidate: 3600 };
  } catch {
    return { props: { hotels: FALLBACK_HOTELS }, revalidate: 60 };
  }
}

const LBL     = { fontSize:10, color:'var(--text-light)', display:'block', marginBottom:3, fontWeight:600, letterSpacing:'.4px', textTransform:'uppercase' };
const VAL     = { fontSize:14, color:'var(--text-dark)', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%' };
const SEE_ALL = { fontSize:13, color:'var(--green-dark)', fontWeight:600 };
