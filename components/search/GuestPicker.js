const DOG_SIZES = [
  { key: '小', label: '小型犬 <10kg' },
  { key: '中', label: '中型犬 10-25kg' },
  { key: '大', label: '大型犬 >25kg' },
];

function Counter({ label, sub, value, min, max, onMinus, onPlus }) {
  return (
    <div style={ROW}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          disabled={value <= min}
          onClick={onMinus}
          style={counterBtn(false, value <= min)}
          aria-label="減少"
        >−</button>
        <span style={{ fontSize: 15, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{value}</span>
        <button
          disabled={value >= max}
          onClick={onPlus}
          style={counterBtn(true, value >= max)}
          aria-label="增加"
        >+</button>
      </div>
    </div>
  );
}

function counterBtn(isPlus, disabled) {
  return {
    width: 32, height: 32,
    borderRadius: '50%',
    border: `1.5px solid ${disabled ? 'var(--border)' : 'var(--green-dark)'}`,
    background: disabled ? 'var(--white)' : (isPlus ? 'var(--green-dark)' : 'var(--white)'),
    color: disabled ? 'var(--border)' : (isPlus ? 'white' : 'var(--green-dark)'),
    cursor: disabled ? 'default' : 'pointer',
    fontSize: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700,
    transition: 'all .15s',
    lineHeight: 1,
  };
}

export default function GuestPicker({ adults, dogs, dogSizes, onChange }) {
  function toggleSize(key) {
    const next = dogSizes.includes(key) ? dogSizes.filter(s => s !== key) : [...dogSizes, key];
    onChange({ dogSizes: next });
  }

  return (
    <div>
      <Counter
        label="🧑 人數" sub="成人"
        value={adults} min={1} max={12}
        onMinus={() => onChange({ adults: adults - 1 })}
        onPlus={() => onChange({ adults: adults + 1 })}
      />
      <Counter
        label="🐶 狗狗數量" sub="最多 5 隻"
        value={dogs} min={1} max={5}
        onMinus={() => onChange({ dogs: dogs - 1 })}
        onPlus={() => onChange({ dogs: dogs + 1 })}
      />

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-light)', marginBottom: 10, letterSpacing: '.4px', textTransform: 'uppercase' }}>
          狗狗大小（可複選）
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DOG_SIZES.map(({ key, label }) => {
            const active = dogSizes.includes(key);
            return (
              <button key={key} onClick={() => toggleSize(key)} style={{
                padding: '7px 14px',
                border: `1.5px solid ${active ? 'var(--green-dark)' : 'var(--border)'}`,
                borderRadius: 20,
                background: active ? 'var(--green-dark)' : 'var(--white)',
                color: active ? 'white' : 'var(--text-mid)',
                fontSize: 12, cursor: 'pointer',
                transition: 'all .15s',
                fontFamily: 'Noto Sans TC, sans-serif',
              }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ROW = {
  display: 'flex', alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid var(--border)',
};
