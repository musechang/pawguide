import { FloorIcon, CartIcon, GrassIcon, DogSizeIcon } from '../icons';

/*
  AmenityGrid
  寵物友善設施總覽。
  以下四項使用自訂 icon（取代 emoji），其餘維持 emoji：
    - dogArea (全區落地 / 不可落地)  → FloorIcon / CartIcon
    - lawn    (附設草皮活動區)       → GrassIcon
    - dogSize (接受狗狗尺寸 — 額外獨立項目) → DogSizeIcon
*/

const EMOJI_AMENITIES = [
  { key: 'park',       label: '附近有公園',   check: '是', icon: '🌳' },
  { key: 'dogpark',    label: '附近狗狗公園', check: '是', icon: '🏃' },
  { key: 'furniture',  label: '可上家具',     check: '可', icon: '🛋️' },
  { key: 'restaurant', label: '可至餐廳區',   check: '是', icon: '🍽️' },
  { key: 'bowl',       label: '提供水碗',     check: '是', icon: '🥣' },
  { key: 'dogBed',     label: '狗狗床鋪',     check: '是', icon: '🛏️' },
  { key: 'dogBath',    label: '狗狗淋浴',     check: '是', icon: '🚿' },
  { key: 'sitter',     label: '狗狗保姆',     check: '是', icon: '👤' },
  { key: 'sensitive',  label: '高敏狗首選',   check: '是', icon: '💚' },
];

function Cell({ children, label, yes, sub }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      borderRadius: 10, border: '1px solid var(--border)',
      background: yes ? 'var(--green-light)' : 'var(--cream)',
      opacity: yes ? 1 : 0.5,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, flexShrink: 0 }}>
        {children}
      </span>
      <div>
        <div style={{ fontSize: 13, fontWeight: yes ? 600 : 400, color: yes ? 'var(--green-dark)' : 'var(--text-mid)' }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{sub}</div>
      </div>
    </div>
  );
}

export default function AmenityGrid({ hotel }) {
  const dogAreaYes = hotel.dogArea === '是';
  const lawnYes    = hotel.lawn === '有';

  return (
    <div className="amenity-grid">
      {/* ── 接受狗狗尺寸 — icon_dog_size ── */}
      <Cell
        yes={!!hotel.dogSize}
        label={hotel.dogSize ? `接受狗狗尺寸：${hotel.dogSize}` : '接受狗狗尺寸'}
        sub={hotel.dogSize ? '✓ 提供' : '✗ 未提供資訊'}
      >
        <DogSizeIcon size={20} color={hotel.dogSize ? 'var(--green-dark)' : 'var(--text-light)'} />
      </Cell>

      {/* ── 全區落地 / 不可落地 — icon_allow_on_the_floor / icon_in_cart ── */}
      <Cell
        yes={dogAreaYes}
        label={dogAreaYes ? '公共區域可落地' : '需使用提籠／推車'}
        sub={dogAreaYes ? '✓ 提供' : '✗ 不提供'}
      >
        {dogAreaYes
          ? <FloorIcon size={20} color="var(--green-dark)" />
          : <CartIcon size={20} color="var(--text-light)" />
        }
      </Cell>

      {/* ── 附設草皮活動區 — icon_grass_area ── */}
      <Cell
        yes={lawnYes}
        label="附設草皮活動區"
        sub={lawnYes ? '✓ 提供' : '✗ 不提供'}
      >
        <GrassIcon size={20} color={lawnYes ? 'var(--green-dark)' : 'var(--text-light)'} />
      </Cell>

      {/* ── 其餘 emoji 項目 ── */}
      {EMOJI_AMENITIES.map(({ key, label, check, icon }) => {
        const yes = hotel[key] === check || hotel[key] === '是';
        return (
          <Cell key={key} yes={yes} label={label} sub={yes ? '✓ 提供' : '✗ 不提供'}>
            <span style={{ fontSize: 18 }}>{icon}</span>
          </Cell>
        );
      })}
    </div>
  );
}
