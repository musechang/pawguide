import { useState } from 'react';
import { useAuth } from '../../lib/hooks';

export default function AuthForm({ defaultTab = 'login', onSuccess }) {
  const [tab, setTab] = useState(defaultTab);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('請填寫所有必填欄位'); return; }
    if (tab === 'signup' && !form.name) { setError('請填寫暱稱'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // mock API
    login({ id: Date.now(), name: form.name || form.email.split('@')[0], email: form.email, avatar: null });
    setLoading(false);
    onSuccess?.();
  }

  return (
    <div style={WRAP}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:32, marginBottom:8 }}>🐾</div>
        <h2 style={{ fontFamily:'Noto Serif TC,serif', fontSize:22, fontWeight:700 }}>
          {tab === 'login' ? '歡迎回來' : '加入 PawGuide'}
        </h2>
        <p style={{ fontSize:13, color:'var(--text-light)', marginTop:4 }}>帶著你的毛孩一起旅行</p>
      </div>

      {/* Tab toggle */}
      <div style={TABS}>
        {[['login','登入'],['signup','註冊']].map(([t, label]) => (
          <button key={t} style={{ ...TAB, ...(tab===t ? TAB_ON : {}) }} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {tab === 'signup' && (
          <div style={FIELD}>
            <label style={LABEL}>暱稱</label>
            <input style={INPUT} type="text" placeholder="你的名字" value={form.name} onChange={set('name')} />
          </div>
        )}
        <div style={FIELD}>
          <label style={LABEL}>Email</label>
          <input style={INPUT} type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
        </div>
        <div style={FIELD}>
          <label style={LABEL}>密碼</label>
          <input style={INPUT} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
        </div>
        {error && <div style={ERR}>{error}</div>}
        <button type="submit" style={SUBMIT} disabled={loading}>
          {loading ? '處理中...' : tab === 'login' ? '登入' : '建立帳號'}
        </button>
      </form>

      <div style={{ marginTop:16, textAlign:'center', fontSize:12, color:'var(--text-light)' }}>
        {tab==='login' ? '還沒有帳號？' : '已經有帳號？'}
        <button style={SWITCH} onClick={() => setTab(tab==='login'?'signup':'login')}>
          {tab==='login' ? '立即註冊' : '登入'}
        </button>
      </div>

      <div style={{ marginTop:20, padding:'14px', background:'var(--green-light)', borderRadius:10, fontSize:12, color:'var(--green-dark)', textAlign:'center' }}>
        🔒 目前為示範版，帳號資料僅存於本機
      </div>
    </div>
  );
}

const WRAP   = { maxWidth:400, margin:'0 auto', padding:'32px 24px', background:'var(--white)', borderRadius:20, border:'1px solid var(--border)', boxShadow:'var(--shadow-md)' };
const TABS   = { display:'flex', marginBottom:24, border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' };
const TAB    = { flex:1, padding:'10px', background:'none', border:'none', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', color:'var(--text-light)', transition:'all .15s' };
const TAB_ON = { background:'var(--green-dark)', color:'white' };
const FIELD  = { marginBottom:14 };
const LABEL  = { display:'block', fontSize:12, fontWeight:600, color:'var(--text-light)', marginBottom:6 };
const INPUT  = { width:'100%', padding:'11px 14px', border:'1.5px solid var(--border)', borderRadius:10, fontSize:14, fontFamily:'Noto Sans TC,sans-serif', outline:'none' };
const ERR    = { background:'#FEE', color:'#C00', fontSize:12, padding:'8px 12px', borderRadius:8, marginBottom:12 };
const SUBMIT = { width:'100%', padding:'13px', background:'var(--green-dark)', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', marginTop:4 };
const SWITCH = { background:'none', border:'none', color:'var(--green-dark)', fontWeight:700, cursor:'pointer', fontSize:12, marginLeft:4, fontFamily:'Noto Sans TC,sans-serif' };
