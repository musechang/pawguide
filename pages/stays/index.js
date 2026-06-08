import { useState, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import HotelCardRow from '../../components/stays/HotelCardRow';
import HotelCard from '../../components/stays/HotelCard';
import FilterPanel, { applyFilters } from '../../components/stays/FilterPanel';
import { FALLBACK_HOTELS } from '../../lib/notion';

const SORT_OPTIONS = [
  { value:'rating',     label:'評分最高' },
  { value:'price_asc',  label:'寵物費：低至高' },
  { value:'price_desc', label:'寵物費：高至低' },
  { value:'name',       label:'名稱排序' },
];

function sortHotels(hotels, sort) {
  const list = [...hotels];
  if (sort === 'rating')     return list.sort((a,b) => b.rating - a.rating);
  if (sort === 'price_asc')  return list.sort((a,b) => (parseFloat(a.price)||0) - (parseFloat(b.price)||0));
  if (sort === 'price_desc') return list.sort((a,b) => (parseFloat(b.price)||0) - (parseFloat(a.price)||0));
  if (sort === 'name')       return list.sort((a,b) => a.name.localeCompare(b.name));
  return list;
}

export default function StaysPage({ hotels }) {
  const [filters, setFilters]         = useState({});
  const [sort, setSort]               = useState('rating');
  const [view, setView]               = useState('list');
  const [filterOpen, setFilterOpen]   = useState(false);

  const results = useMemo(() => sortHotels(applyFilters(hotels, filters), sort), [hotels, filters, sort]);
  const activeCount = Object.values(filters).flat().length;

  return (
    <div className="stays-page">
      {/* Top bar */}
      <div className="stays-topbar">
        <div style={{ fontSize:14, color:'var(--text-mid)' }}>
          找到 <strong>{results.length}</strong> 間狗狗友善住宿
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Mobile filter button */}
          <button className="filter-toggle-btn" onClick={() => setFilterOpen(true)}>
            🔧 篩選{activeCount > 0 && <span style={BADGE}>{activeCount}</span>}
          </button>
          <select value={sort} onChange={e => setSort(e.target.value)} style={SELECT}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div style={VIEW_TOGGLE}>
            <button style={{ ...VIEW_BTN, ...(view==='list' ? VIEW_ON : {}) }} onClick={() => setView('list')}>☰</button>
            <button style={{ ...VIEW_BTN, ...(view==='grid' ? VIEW_ON : {}) }} onClick={() => setView('grid')}>⊞</button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="stays-body">
        {/* Desktop filter sidebar */}
        <aside className="filter-aside hide-sm">
          <FilterPanel filters={filters} onChange={setFilters} />
        </aside>

        {/* Results */}
        <section style={{ minWidth:0 }}>
          {results.length === 0 ? (
            <div style={EMPTY}>
              <div style={{ fontSize:48, marginBottom:12 }}>🐕</div>
              <div style={{ fontWeight:700, marginBottom:8 }}>沒有符合的住宿</div>
              <div style={{ fontSize:13, color:'var(--text-light)', marginBottom:16 }}>試著調整篩選條件</div>
              <button style={RESET_BTN} onClick={() => setFilters({})}>清除篩選</button>
            </div>
          ) : view === 'list' ? (
            results.map(h => <HotelCardRow key={h.id} hotel={h} />)
          ) : (
            <div className="hotel-grid">
              {results.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter drawer */}
      <div className={`filter-drawer-overlay${filterOpen ? ' open' : ''}`} onClick={() => setFilterOpen(false)} />
      <div className={`filter-drawer${filterOpen ? ' open' : ''}`}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span style={{ fontWeight:700, fontSize:16 }}>條件篩選</span>
          <button onClick={() => setFilterOpen(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer' }}>✕</button>
        </div>
        <FilterPanel filters={filters} onChange={setFilters} />
        <button style={{ ...RESET_BTN, width:'100%', marginTop:16 }} onClick={() => setFilterOpen(false)}>
          套用篩選（{results.length} 間）
        </button>
      </div>
    </div>
  );
}

StaysPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps() {
  try {
    const { fetchHotels } = await import('../../lib/notion');
    const hotels = await fetchHotels();
    return { props: { hotels }, revalidate: 3600 };
  } catch {
    return { props: { hotels: FALLBACK_HOTELS }, revalidate: 60 };
  }
}

const SELECT     = { padding:'8px 12px', border:'1.5px solid var(--border)', borderRadius:10, fontSize:13, background:'var(--white)', cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', outline:'none' };
const VIEW_TOGGLE= { display:'flex', border:'1.5px solid var(--border)', borderRadius:10, overflow:'hidden' };
const VIEW_BTN   = { padding:'7px 12px', background:'none', border:'none', fontSize:14, cursor:'pointer', color:'var(--text-mid)', transition:'all .15s' };
const VIEW_ON    = { background:'var(--green-dark)', color:'white' };
const EMPTY      = { textAlign:'center', padding:'80px 0', display:'flex', flexDirection:'column', alignItems:'center' };
const RESET_BTN  = { padding:'10px 24px', background:'var(--green-dark)', color:'white', border:'none', borderRadius:10, fontSize:13, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif' };
const BADGE      = { marginLeft:6, background:'var(--green-dark)', color:'white', borderRadius:20, padding:'1px 7px', fontSize:11 };
