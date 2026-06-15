import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth, useSearchDisplay } from '../../lib/hooks';
import SearchPopup from '../search/SearchPopup';

export default function Navbar({ hideSearch = false }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { locLabel, guestLabel } = useSearchDisplay(); // 日期欄已移除
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef(null);
  const isHome = router.pathname === '/';
  const showSearch = !isHome && !hideSearch;

  useEffect(() => {
    const fn = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <>
      <nav className="nav">
        {/* ── Logo ── */}
        <Link href="/" className="nav-logo" style={{ flexShrink: 0, lineHeight: 0 }}>
          <img src="/assets/logo-hp.png" alt="PawGuide" height={36}
            style={{ maxHeight: 36, width: 'auto' }}
            className="nav-logo-desktop"
            onError={e => e.target.style.display = 'none'} />
          <img src="/assets/logo-mobile.png" alt="PawGuide" height={28}
            style={{ maxHeight: 28, width: 'auto', display: 'none' }}
            className="nav-logo-mobile"
            onError={e => e.target.style.display = 'none'} />
        </Link>

        {/* ── Desktop compact search (地點 + 旅客，無日期) ── */}
        {showSearch && (
          <button onClick={() => setSearchOpen(true)} className="nav-compact-bar nav-search-desktop">
            <span className="nav-compact-field">
              <small style={LBL}>地點</small>
              <span style={VAL}>{locLabel}</span>
            </span>
            <span className="nav-compact-field" style={{ borderRight: 'none' }}>
              <small style={LBL}>旅客</small>
              <span style={VAL}>{guestLabel}</span>
            </span>
            <span style={NAV_BTN}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
          </button>
        )}

        {/* ── Right ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Mobile search icon */}
          {showSearch && (
            <button className="nav-search-mobile" onClick={() => setSearchOpen(true)}
              aria-label="搜尋" style={ICON_BTN}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          )}

          {/* Auth: login button OR avatar, never both */}
          {!user ? (
            <Link href="/account" style={LOGIN_BTN}>登入</Link>
          ) : (
            <div ref={userRef} style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(v => !v)} style={AVATAR_BTN} aria-label="帳號選單">
                {user.avatar
                  ? <img src={user.avatar} alt="" width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 18 }}>🐕</span>
                }
              </button>
              {userMenuOpen && (
                <div style={USER_MENU}>
                  <div style={MENU_NAME}>{user.name}</div>
                  <Link href="/account"                style={MENU_ITEM} onClick={() => setUserMenuOpen(false)}>個人資料</Link>
                  <Link href="/account?tab=favourites" style={MENU_ITEM} onClick={() => setUserMenuOpen(false)}>我的收藏</Link>
                  <Link href="/account?tab=reviews"    style={MENU_ITEM} onClick={() => setUserMenuOpen(false)}>我的評論</Link>
                  <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                  <button style={{ ...MENU_ITEM, width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'none' }}
                    onClick={() => { logout(); setUserMenuOpen(false); }}>登出</button>
                </div>
              )}
            </div>
          )}

          <button style={HAMBURGER} aria-label="選單">
            <span style={BAR}/><span style={BAR}/><span style={BAR}/>
          </button>
        </div>
      </nav>

      {searchOpen && (
        <SearchPopup
          onClose={() => setSearchOpen(false)}
          onSearch={() => { setSearchOpen(false); router.push('/stays'); }}
          hideDate
        />
      )}

      <style>{`
        .nav-logo-desktop { display: block !important; }
        .nav-logo-mobile  { display: none  !important; }
        .nav-search-desktop { display: flex; }
        .nav-search-mobile  { display: none !important; }
        @media (max-width: 768px) {
          .nav-logo-desktop   { display: none  !important; }
          .nav-logo-mobile    { display: block !important; }
          .nav-search-desktop { display: none  !important; }
          .nav-search-mobile  { display: flex  !important; }
        }
      `}</style>
    </>
  );
}

const LBL        = { fontSize: 10, color: 'var(--text-light)', display: 'block', marginBottom: 1 };
const VAL        = { fontSize: 12, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const NAV_BTN    = { backgroundColor: 'var(--green-dark)', backgroundImage: 'none', padding: '8px 14px', borderRadius: '0 40px 40px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 42, alignSelf: 'stretch' };
const ICON_BTN   = { width: 36, height: 36, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' };
const LOGIN_BTN  = { fontSize: 13, fontWeight: 600, color: 'var(--green-dark)', padding: '7px 16px', border: '1.5px solid var(--green-dark)', borderRadius: 20, textDecoration: 'none', whiteSpace: 'nowrap' };
const AVATAR_BTN = { width: 36, height: 36, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', overflow: 'hidden' };
const USER_MENU  = { position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', minWidth: 180, padding: '8px 0', zIndex: 400 };
const MENU_NAME  = { padding: '8px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-mid)', borderBottom: '1px solid var(--border)', marginBottom: 4 };
const MENU_ITEM  = { display: 'block', padding: '10px 16px', fontSize: 13, color: 'var(--text-dark)' };
const HAMBURGER  = { cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 4, background: 'none', border: 'none' };
const BAR        = { width: 20, height: 2, background: 'var(--text-dark)', display: 'block', borderRadius: 2 };
