const TW_CITIES = ['台北市','新北市','基隆市','桃園市','新竹市','新竹縣','苗栗縣','台中市','彰化縣','南投縣','雲林縣','嘉義市','嘉義縣','台南市','高雄市','屏東縣','宜蘭縣','花蓮縣','台東縣','澎湖縣','金門縣','連江縣'];

export default function LocationPicker({ value, onChange }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 16 }}>選擇目的地縣市</p>
      <div className="loc-picker-grid">
        {TW_CITIES.map(city => (
          <button
            key={city}
            style={{ ...ITEM, ...(value === city ? ITEM_ACTIVE : {}) }}
            onClick={() => onChange(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export { TW_CITIES };

const GRID = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 };
const ITEM = { padding: '10px 8px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--white)', fontSize: 13, cursor: 'pointer', transition: 'all .15s', fontFamily: 'Noto Sans TC,sans-serif' };
const ITEM_ACTIVE = { background: 'var(--green-dark)', color: 'white', borderColor: 'var(--green-dark)' };
