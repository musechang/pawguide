const AMENITIES = [
  { key:'dogArea',    label:'全區落地',     check:'是', icon:'🐾' },
  { key:'lawn',       label:'附設草皮區',   check:'有', icon:'🌿' },
  { key:'park',       label:'附近有公園',   check:'是', icon:'🌳' },
  { key:'dogpark',    label:'附近狗狗公園', check:'是', icon:'🏃' },
  { key:'furniture',  label:'可上家具',     check:'可', icon:'🛋️' },
  { key:'restaurant', label:'可至餐廳區',   check:'是', icon:'🍽️' },
  { key:'bowl',       label:'提供水碗',     check:'是', icon:'🥣' },
  { key:'dogBed',     label:'狗狗床鋪',     check:'是', icon:'🛏️' },
  { key:'dogBath',    label:'狗狗淋浴',     check:'是', icon:'🚿' },
  { key:'sitter',     label:'狗狗保姆',     check:'是', icon:'👤' },
  { key:'sensitive',  label:'高敏狗首選',   check:'是', icon:'💚' },
];

export default function AmenityGrid({ hotel }) {
  return (
    <div className="amenity-grid">
      {AMENITIES.map(({ key, label, check, icon }) => {
        const yes = hotel[key] === check || hotel[key] === '是';
        return (
          <div key={key} style={{
            display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
            borderRadius:10, border:'1px solid var(--border)',
            background: yes ? 'var(--green-light)' : 'var(--cream)',
            opacity: yes ? 1 : 0.5,
          }}>
            <span style={{ fontSize:18 }}>{icon}</span>
            <div>
              <div style={{ fontSize:13, fontWeight: yes?600:400, color: yes?'var(--green-dark)':'var(--text-mid)' }}>{label}</div>
              <div style={{ fontSize:11, color:'var(--text-light)' }}>{yes ? '✓ 提供' : '✗ 不提供'}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
