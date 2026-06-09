/* ══════════════════════════════════════════
   lib/store.js
   Lightweight client-side state store.
   No external state library needed —
   uses a simple subscriber pattern.
══════════════════════════════════════════ */

// ── Search state ──────────────────────────
let _search = {
  loc: '',
  checkin: null,   // Date | null
  checkout: null,  // Date | null
  adults: 2,
  dogs: 1,
  dogSizes: [],    // ['小','中','大']
};

const _searchListeners = new Set();

export const searchStore = {
  get: () => ({ ..._search }),
  set: (patch) => {
    _search = { ..._search, ...patch };
    _searchListeners.forEach(fn => fn(_search));
  },
  subscribe: (fn) => {
    _searchListeners.add(fn);
    return () => _searchListeners.delete(fn);
  },
};

// ── Auth state ────────────────────────────
let _user = null;  // { id, name, email, avatar } | null

const _authListeners = new Set();

export const authStore = {
  get: () => _user,
  login: (user) => {
    _user = user;
    try { localStorage.setItem('PawGuide_user', JSON.stringify(user)); } catch {}
    _authListeners.forEach(fn => fn(_user));
  },
  logout: () => {
    _user = null;
    try { localStorage.removeItem('PawGuide_user'); } catch {}
    _authListeners.forEach(fn => fn(_user));
  },
  restore: () => {
    try {
      const raw = localStorage.getItem('PawGuide_user');
      if (raw) { _user = JSON.parse(raw); _authListeners.forEach(fn => fn(_user)); }
    } catch {}
  },
  subscribe: (fn) => {
    _authListeners.add(fn);
    return () => _authListeners.delete(fn);
  },
};

// ── Favourites state ──────────────────────
let _favs = new Set();
const _favListeners = new Set();

export const favStore = {
  getAll: () => [..._favs],
  has: (id) => _favs.has(id),
  toggle: (id) => {
    if (_favs.has(id)) _favs.delete(id); else _favs.add(id);
    try { localStorage.setItem('PawGuide_favs', JSON.stringify([..._favs])); } catch {}
    _favListeners.forEach(fn => fn([..._favs]));
  },
  restore: () => {
    try {
      const raw = localStorage.getItem('PawGuide_favs');
      if (raw) { _favs = new Set(JSON.parse(raw)); _favListeners.forEach(fn => fn([..._favs])); }
    } catch {}
  },
  subscribe: (fn) => {
    _favListeners.add(fn);
    return () => _favListeners.delete(fn);
  },
};

// ── Reviews (local mock) ──────────────────
let _reviews = [];
const _reviewListeners = new Set();

export const reviewStore = {
  getAll: () => [..._reviews],
  getByHotel: (hotelId) => _reviews.filter(r => r.hotelId === hotelId),
  add: (review) => {
    _reviews = [{ ...review, id: Date.now(), createdAt: new Date().toISOString() }, ..._reviews];
    try { localStorage.setItem('PawGuide_reviews', JSON.stringify(_reviews)); } catch {}
    _reviewListeners.forEach(fn => fn(_reviews));
  },
  restore: () => {
    try {
      const raw = localStorage.getItem('PawGuide_reviews');
      if (raw) { _reviews = JSON.parse(raw); _reviewListeners.forEach(fn => fn(_reviews)); }
    } catch {}
  },
  subscribe: (fn) => {
    _reviewListeners.add(fn);
    return () => _reviewListeners.delete(fn);
  },
};
