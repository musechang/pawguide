import Link from 'next/link';

const COLS = [
  { title: '關於我們', links: [['我們的理念', '/#'], ['房源政策', '/#'], ['狗狗旅行守則', '/#'], ['聯絡我們', '/#']] },
  { title: '合作夥伴', links: [['申請成為狗狗友善房源', '/partner'], ['申請成為評鑑員', '/#'], ['狗狗保姆', '/#'], ['狗狗友善計程車', '/#']] },
  { title: '探索',    links: [['住宿指南', '/blog'], ['熱門目的地', '/stays'], ['大型犬友善', '/stays?dogSize=大'], ['Blog', '/blog']] },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <img
              src="/assets/logo.png"
              alt="PawGuide"
              width={32} height={32}
              style={{ borderRadius: 6, opacity: .9 }}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
            />
            {/* Inline fallback logo */}
            <svg style={{ display: 'none' }} width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#3D7A52"/>
              <ellipse cx="20" cy="23" rx="7" ry="6" fill="white" opacity="0.95"/>
              <ellipse cx="13" cy="17" rx="2.8" ry="2.5" fill="white" opacity="0.95"/>
              <ellipse cx="18" cy="14.5" rx="2.8" ry="2.5" fill="white" opacity="0.95"/>
              <ellipse cx="23" cy="14.5" rx="2.8" ry="2.5" fill="white" opacity="0.95"/>
              <ellipse cx="28" cy="17" rx="2.8" ry="2.5" fill="white" opacity="0.95"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 18 }}>PawGuide</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', lineHeight: 1.7 }}>
            收錄全台歡迎寵物的店家，<br />找到適合你家狗狗的友善住宿。
          </p>
        </div>

        {COLS.map(col => (
          <div key={col.title}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: '#A8C8B4' }}>{col.title}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">© 2024 PawGuide · 讓毛孩也能一起旅行</div>
    </footer>
  );
}
