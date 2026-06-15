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
          {/* Footer wordmark logo (logo-footer.png) */}
          <img
            src="/assets/logo-footer.png"
            alt="PawGuide"
            style={{ height: 22, maxWidth: 140, width: 'auto', objectFit: 'contain', marginBottom: 12 }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback text */}
          <div style={{ display: 'none', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>🐾 PawGuide</div>
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
