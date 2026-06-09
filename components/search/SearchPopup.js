import { useState, useEffect } from 'react';
import { useSearch } from '../../lib/hooks';
import LocationPicker from './LocationPicker';
import GuestPicker from './GuestPicker';
import DateRangePicker from './DateRangePicker';

export default function SearchPopup({ onClose, onSearch, hideDate = false }) {
  const [search, setSearch] = useSearch();
  // If hideDate, only show loc + guest tabs
  const TABS = hideDate
    ? [{ key:'loc', label:'地點' }, { key:'guest', label:'旅客與毛孩' }]
    : [{ key:'loc', label:'地點' }, { key:'date', label:'日期' }, { key:'guest', label:'旅客與毛孩' }];
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div style={OVERLAY} onClick={onClose}>
      <div className="search-popup-modal" onClick={e => e.stopPropagation()}>
        {/* Tab bar */}
        <div style={TAB_BAR}>
          {TABS.map(t => (
            <button key={t.key}
              style={{ ...TAB, ...(activeTab === t.key ? TAB_ACTIVE : {}) }}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
          <button style={CLOSE_BTN} onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px 24px' }}>
          {activeTab === 'loc' && (
            <LocationPicker
              value={search.loc}
              onChange={loc => { setSearch({ loc }); setActiveTab(hideDate ? 'guest' : 'date'); }}
            />
          )}
          {activeTab === 'date' && (
            <DateRangePicker
              checkin={search.checkin}
              checkout={search.checkout}
              onChange={(checkin, checkout) => setSearch({ checkin, checkout })}
              onConfirm={() => setActiveTab('guest')}
            />
          )}
          {activeTab === 'guest' && (
            <GuestPicker
              adults={search.adults}
              dogs={search.dogs}
              dogSizes={search.dogSizes}
              onChange={patch => setSearch(patch)}
            />
          )}
        </div>

        {/* Footer */}
        <div style={FOOTER}>
          <button style={CLEAR_BTN}
            onClick={() => setSearch({ loc:'', checkin:null, checkout:null, adults:2, dogs:1, dogSizes:[] })}>
            清除全部
          </button>
          <button style={SEARCH_BTN} onClick={onSearch}>🔍 搜尋</button>
        </div>
      </div>
    </div>
  );
}

const OVERLAY    = { position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 };
const TAB_BAR    = { display:'flex', alignItems:'center', borderBottom:'1px solid var(--border)', padding:'0 12px' };
const TAB        = { flex:1, padding:'16px 8px', background:'none', border:'none', borderBottom:'2px solid transparent', fontSize:13, fontWeight:600, cursor:'pointer', color:'var(--text-light)', transition:'all .15s', fontFamily:'Noto Sans TC,sans-serif' };
const TAB_ACTIVE = { color:'var(--green-dark)', borderBottomColor:'var(--green-dark)' };
const CLOSE_BTN  = { marginLeft:'auto', padding:'8px 12px', background:'none', border:'none', fontSize:18, cursor:'pointer', color:'var(--text-light)' };
const FOOTER     = { padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' };
const CLEAR_BTN  = { background:'none', border:'none', fontSize:13, cursor:'pointer', textDecoration:'underline', color:'var(--text-mid)', fontFamily:'Noto Sans TC,sans-serif' };
const SEARCH_BTN = { padding:'12px 28px', background:'var(--green-dark)', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif' };
