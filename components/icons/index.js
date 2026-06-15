/* ══════════════════════════════════════════
   icons.js
   Custom SVG icon set for PawGuide.
   Matches the green (#1C3C2A) brand line-icon
   style used across the design system.

   - PawOutline / PawSolid  → official "paw" rating
   - FloorIcon / CartIcon   → 全區落地 / 不可落地
   - GrassIcon              → 附設草皮活動區
   - DogSizeIcon            → 接受狗狗尺寸
══════════════════════════════════════════ */

const base = { viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' };

/* ── icon_review_outline — 空心爪印（未獲得的評分）── */
export function PawOutline({ size = 18, color = 'var(--border)' }) {
  return (
    <svg {...base} width={size} height={size} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <ellipse cx="12" cy="15.2" rx="5.2" ry="4.4"/>
      <ellipse cx="5.4" cy="9.8"  rx="2.1" ry="2.6" transform="rotate(-18 5.4 9.8)"/>
      <ellipse cx="9.6" cy="6.2"  rx="2.1" ry="2.6" transform="rotate(-8 9.6 6.2)"/>
      <ellipse cx="14.4" cy="6.2" rx="2.1" ry="2.6" transform="rotate(8 14.4 6.2)"/>
      <ellipse cx="18.6" cy="9.8" rx="2.1" ry="2.6" transform="rotate(18 18.6 9.8)"/>
    </svg>
  );
}

/* ── icon_review_solid — 實心爪印（已獲得的評分）── */
export function PawSolid({ size = 18, color = 'var(--green-dark)' }) {
  return (
    <svg {...base} width={size} height={size} fill={color}>
      <ellipse cx="12" cy="15.2" rx="5.2" ry="4.4"/>
      <ellipse cx="5.4" cy="9.8"  rx="2.1" ry="2.6" transform="rotate(-18 5.4 9.8)"/>
      <ellipse cx="9.6" cy="6.2"  rx="2.1" ry="2.6" transform="rotate(-8 9.6 6.2)"/>
      <ellipse cx="14.4" cy="6.2" rx="2.1" ry="2.6" transform="rotate(8 14.4 6.2)"/>
      <ellipse cx="18.6" cy="9.8" rx="2.1" ry="2.6" transform="rotate(18 18.6 9.8)"/>
    </svg>
  );
}

/* ── icon_allow_on_the_floor — 狗狗可在地面活動（地板 + 爪印）── */
export function FloorIcon({ size = 18, color = 'var(--green-dark)' }) {
  return (
    <svg {...base} width={size} height={size} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {/* ground line */}
      <path d="M2.5 19h19"/>
      {/* small paw print floating above ground */}
      <ellipse cx="12" cy="13.6" rx="3.4" ry="2.9" fill={color} stroke="none"/>
      <ellipse cx="8.1" cy="10.1" rx="1.4" ry="1.7" transform="rotate(-18 8.1 10.1)" fill={color} stroke="none"/>
      <ellipse cx="10.4" cy="7.6" rx="1.4" ry="1.7" transform="rotate(-8 10.4 7.6)" fill={color} stroke="none"/>
      <ellipse cx="13.6" cy="7.6" rx="1.4" ry="1.7" transform="rotate(8 13.6 7.6)" fill={color} stroke="none"/>
      <ellipse cx="15.9" cy="10.1" rx="1.4" ry="1.7" transform="rotate(18 15.9 10.1)" fill={color} stroke="none"/>
    </svg>
  );
}

/* ── icon_in_cart — 狗狗需待在提籠／推車內（不可自由落地）── */
export function CartIcon({ size = 18, color = 'var(--text-light)' }) {
  return (
    <svg {...base} width={size} height={size} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {/* carrier body */}
      <rect x="4" y="8" width="16" height="10" rx="2.5"/>
      {/* handle */}
      <path d="M8 8V6a4 4 0 0 1 8 0v2"/>
      {/* grille lines */}
      <path d="M8 12h8M8 15h8"/>
    </svg>
  );
}

/* ── icon_grass_area — 附設草皮活動區（草葉造型）── */
export function GrassIcon({ size = 18, color = 'var(--green-dark)' }) {
  return (
    <svg {...base} width={size} height={size} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20c0-5 2-9 5-9"/>
      <path d="M8 20c0-7 3-12 6-12"/>
      <path d="M14 20c0-6 3-10.5 6.5-11.5"/>
      <path d="M3 20h18"/>
    </svg>
  );
}

/* ── icon_dog_size — 接受狗狗尺寸（大中小三隻狗側影）── */
export function DogSizeIcon({ size = 18, color = 'var(--green-dark)' }) {
  return (
    <svg {...base} width={size} height={size} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* baseline */}
      <path d="M2 20h20"/>
      {/* small dog */}
      <path d="M3.5 20v-2.2a1.6 1.6 0 0 1 1.6-1.6h1.8a1.6 1.6 0 0 1 1.6 1.6V20"/>
      <circle cx="4.4" cy="14.4" r="1.1"/>
      {/* medium dog */}
      <path d="M10 20v-3.4a2.2 2.2 0 0 1 2.2-2.2h2.6a2.2 2.2 0 0 1 2.2 2.2V20"/>
      <circle cx="11.2" cy="12.6" r="1.4"/>
      {/* large dog */}
      <path d="M17.5 20v-5a3 3 0 0 1 3-3h1.5"/>
      <circle cx="19" cy="10.3" r="1.7"/>
    </svg>
  );
}
