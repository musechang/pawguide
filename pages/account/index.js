import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import AuthForm from '../../components/account/AuthForm';
import HotelCard from '../../components/stays/HotelCard';
import { useAuth, useFavourites, useReviews } from '../../lib/hooks';
import { FALLBACK_HOTELS } from '../../lib/notion';

const TABS = [
  { key:'profile',    label:'👤 個人資料' },
  { key:'favourites', label:'♥ 我的收藏' },
  { key:'reviews',    label:'✍️ 我的評論' },
];

export default function AccountPage({ hotels }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { favs } = useFavourites();
  const { reviews } = useReviews();
  const tab = router.query.tab || 'profile';

  const favHotels = hotels.filter(h => favs.includes(h.id));
  const myReviews = reviews.filter(r => r.userName === user?.name);

  if (!user) {
    return (
      <div style={{ maxWidth:460, margin:'60px auto', padding:'0 16px' }}>
        <AuthForm
          defaultTab={router.query.tab === 'signup' ? 'signup' : 'login'}
          onSuccess={() => router.replace('/account')}
        />
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* Sidebar / tab bar */}
      <aside className="account-sidebar">
        <div style={{ textAlign:'center', marginBottom:12 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--green-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, margin:'0 auto 8px' }}>
            {user.avatar ? <img src={user.avatar} alt="" style={{ width:72, height:72, borderRadius:'50%', objectFit:'cover' }} /> : '🐕'}
          </div>
          <div style={{ fontWeight:700, fontSize:16 }}>{user.name}</div>
          <div style={{ fontSize:12, color:'var(--text-light)' }}>{user.email}</div>
        </div>
        {TABS.map(t => (
          <button key={t.key}
            className={`account-tab-btn${tab===t.key?' active':''}`}
            onClick={() => router.push(`/account?tab=${t.key}`)}>
            {t.label}
          </button>
        ))}
        <button
          style={{ marginTop:8, width:'100%', padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'none', fontSize:13, cursor:'pointer', color:'var(--text-light)', fontFamily:'Noto Sans TC,sans-serif' }}
          onClick={() => { logout(); router.push('/'); }}>
          登出
        </button>
      </aside>

      {/* Content */}
      <main style={{ minWidth:0 }}>
        {tab === 'profile' && (
          <div>
            <h2 style={TITLE}>個人資料</h2>
            <div style={PROFILE_CARD}>
              {[['暱稱', user.name],['Email', user.email],['收藏住宿', `${favs.length} 間`],['發表評論', `${myReviews.length} 則`]].map(([k,v]) => (
                <div key={k} style={PROFILE_ROW}>
                  <span style={{ color:'var(--text-light)', fontWeight:600 }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, padding:16, background:'var(--green-light)', borderRadius:12, fontSize:13, color:'var(--green-dark)' }}>
              🔒 目前為示範版，帳號資料僅存於本機瀏覽器
            </div>
          </div>
        )}

        {tab === 'favourites' && (
          <div>
            <h2 style={TITLE}>我的收藏（{favHotels.length}）</h2>
            {favHotels.length === 0 ? <Empty icon="♡" text="還沒有收藏任何住宿" /> : (
              <div className="fav-grid">
                {favHotels.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          <div>
            <h2 style={TITLE}>我的評論（{myReviews.length}）</h2>
            {myReviews.length === 0 ? <Empty icon="✍️" text="還沒有發表任何評論" /> : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {myReviews.map(r => (
                  <div key={r.id} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
                    <div style={{ fontWeight:700, marginBottom:4 }}>{'🐾'.repeat(r.rating)}</div>
                    <p style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.7 }}>{r.comment}</p>
                    <div style={{ fontSize:11, color:'var(--text-light)', marginTop:8 }}>
                      {new Date(r.createdAt).toLocaleDateString('zh-TW')}
                      {r.userDog && ` · 與 ${r.userDog} 同行`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Empty({ icon, text }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
      <div style={{ fontSize:48 }}>{icon}</div>
      <div style={{ fontWeight:600 }}>{text}</div>
      <a href="/stays" style={{ padding:'10px 24px', background:'var(--green-dark)', color:'white', borderRadius:10, fontSize:13 }}>探索住宿</a>
    </div>
  );
}

AccountPage.getLayout = (page) => <Layout>{page}</Layout>;
export async function getStaticProps() { return { props: { hotels: FALLBACK_HOTELS } }; }

const TITLE       = { fontFamily:'Noto Serif TC,serif', fontSize:20, fontWeight:700, marginBottom:20 };
const PROFILE_CARD= { background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' };
const PROFILE_ROW = { display:'flex', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid var(--border)', fontSize:14 };
