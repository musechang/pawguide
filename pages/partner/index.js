import Layout from '../../components/layout/Layout';

const STEPS = [
  { num:'01', title:'填寫申請表單', desc:'告訴我們你的住宿基本資訊、地點、接受的狗狗大小，以及你提供的寵物友善設施。' },
  { num:'02', title:'PawGuide 審核', desc:'我們的審核團隊會在 5 個工作天內聯繫你，確認你的住宿符合我們的狗狗友善標準。' },
  { num:'03', title:'完成設定', desc:'審核通過後，我們會協助你完善住宿頁面，包含照片上傳、設施標記等。' },
  { num:'04', title:'開始接待毛孩旅客', desc:'你的住宿將出現在 PawGuide 平台上，開始接觸數千位帶狗旅行的旅客！' },
];

const BENEFITS = [
  { icon:'🐾', title:'接觸精準客群', desc:'PawGuide 的旅客都是帶狗旅行的主人，他們對寵物友善住宿有強烈需求。' },
  { icon:'📸', title:'免費頁面建置', desc:'我們協助你建立完整的住宿頁面，包含照片、設施標記與評分系統。' },
  { icon:'⭐', title:'評分認證系統', desc:'通過 PawGuide 認證的住宿，在旅客心中更具信任感與吸引力。' },
  { icon:'📊', title:'數據分析', desc:'查看你的住宿瀏覽次數、旅客偏好與詢問量，優化你的服務。' },
];

export default function PartnerPage() {
  return (
    <div>
      {/* Hero */}
      <div style={HERO}>
        <h1 style={HERO_TITLE}>成為 PawGuide 合作旅宿</h1>
        <p style={HERO_SUB}>加入全台最大的狗狗友善住宿平台，接觸數千位帶狗旅行的旅客</p>
        <a href="#apply" style={CTA_BTN}>立即申請合作</a>
      </div>

      {/* Benefits */}
      <div style={SECTION}>
        <h2 style={SECTION_TITLE}>為什麼選擇 PawGuide？</h2>
        <div className="partner-benefit-grid">
          {BENEFITS.map(b => (
            <div key={b.title} style={BENEFIT_CARD}>
              <div style={{ fontSize:36, marginBottom:12 }}>{b.icon}</div>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{b.title}</h3>
              <p style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.7 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ ...SECTION, background:'var(--green-light)', borderRadius:24, margin:'0 48px' }}>
        <h2 style={SECTION_TITLE}>申請流程</h2>
        <div style={STEPS_LIST}>
          {STEPS.map(s => (
            <div key={s.num} style={STEP}>
              <div style={STEP_NUM}>{s.num}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>{s.title}</div>
                <div style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.7 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply form */}
      <div id="apply" style={{ ...SECTION, maxWidth:600, margin:'0 auto', paddingBottom:60 }}>
        <h2 style={SECTION_TITLE}>填寫申請資料</h2>
        <form style={FORM} onSubmit={e => { e.preventDefault(); alert('感謝申請！我們會在 5 個工作天內與您聯繫。'); }}>
          {[
            ['旅宿名稱 *','text','你的旅宿名稱'],
            ['聯絡人姓名 *','text','負責人姓名'],
            ['聯絡 Email *','email','contact@example.com'],
            ['聯絡電話','tel','09xx-xxx-xxx'],
            ['旅宿地址 *','text','縣市、鄉鎮市區、詳細地址'],
            ['接受狗狗大小','text','例：小型犬、中型犬'],
          ].map(([label, type, placeholder]) => (
            <div key={label} style={FORM_FIELD}>
              <label style={FORM_LABEL}>{label}</label>
              <input type={type} placeholder={placeholder} style={FORM_INPUT} required={label.includes('*')} />
            </div>
          ))}
          <div style={FORM_FIELD}>
            <label style={FORM_LABEL}>提供的寵物友善設施（可複選）</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:6 }}>
              {['全區落地','有草地區','可上家具','提供水碗','狗狗床鋪','可至餐廳'].map(f => (
                <label key={f} style={CHECKBOX_ITEM}>
                  <input type="checkbox" style={{ marginRight:4 }} />{f}
                </label>
              ))}
            </div>
          </div>
          <div style={FORM_FIELD}>
            <label style={FORM_LABEL}>其他說明</label>
            <textarea placeholder="任何你想讓我們知道的事..." style={{ ...FORM_INPUT, height:100, resize:'vertical' }} />
          </div>
          <button type="submit" style={SUBMIT}>送出申請</button>
        </form>
      </div>
    </div>
  );
}

PartnerPage.getLayout = (page) => <Layout>{page}</Layout>;

const HERO         = { background:'var(--green-dark)', color:'white', padding:'80px 48px', textAlign:'center' };
const HERO_TITLE   = { fontFamily:'Noto Serif TC,serif', fontSize:40, fontWeight:700, marginBottom:12 };
const HERO_SUB     = { fontSize:16, color:'rgba(255,255,255,.75)', marginBottom:28, maxWidth:600, margin:'0 auto 28px' };
const CTA_BTN      = { display:'inline-block', padding:'14px 32px', background:'white', color:'var(--green-dark)', borderRadius:12, fontWeight:700, fontSize:15, textDecoration:'none' };
const SECTION      = { padding:'60px 48px', maxWidth:1100, margin:'0 auto' };
const SECTION_TITLE= { fontFamily:'Noto Serif TC,serif', fontSize:26, fontWeight:700, marginBottom:32, textAlign:'center' };
const BENEFIT_GRID = { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 };
const BENEFIT_CARD = { padding:24, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, textAlign:'center' };
const STEPS_LIST   = { display:'flex', flexDirection:'column', gap:24 };
const STEP         = { display:'grid', gridTemplateColumns:'60px 1fr', gap:16, alignItems:'flex-start' };
const STEP_NUM     = { width:52, height:52, borderRadius:'50%', background:'var(--green-dark)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, flexShrink:0 };
const FORM         = { display:'flex', flexDirection:'column', gap:16 };
const FORM_FIELD   = { display:'flex', flexDirection:'column', gap:6 };
const FORM_LABEL   = { fontSize:13, fontWeight:600, color:'var(--text-mid)' };
const FORM_INPUT   = { padding:'11px 14px', border:'1.5px solid var(--border)', borderRadius:10, fontSize:14, fontFamily:'Noto Sans TC,sans-serif', outline:'none', background:'var(--white)' };
const CHECKBOX_ITEM= { display:'flex', alignItems:'center', fontSize:13, padding:'6px 12px', border:'1px solid var(--border)', borderRadius:20, cursor:'pointer', background:'var(--white)' };
const SUBMIT       = { padding:'14px', background:'var(--green-dark)', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', marginTop:8 };
