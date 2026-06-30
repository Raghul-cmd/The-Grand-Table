/* ══════════════════════════════════════════════════════════════
   script.js — Customer Website JavaScript
   ──────────────────────────────────────────────────────────────
   EDIT SECTION 1 & 2 below to configure your site
══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   SECTION 1: SUPABASE CONFIGURATION
   Get these from: supabase.com → Your Project → Settings → API
══════════════════════════════════════════════════════════════ */
const SUPABASE_URL  = 'https://jwiwollnpjqskthrfnsc.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3aXdvbGxucGpxc2t0aHJmbnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDIwMzcsImV4cCI6MjA5ODM3ODAzN30.9ysuA-JzaKxTs6AZvXNJNAsbRtm9m5mjZOqmyW92BlU';

/* ══════════════════════════════════════════════════════════════
   SECTION 2: STORE LOCATIONS
   EDIT: Replace all 5 entries with your real branch data
══════════════════════════════════════════════════════════════ */
const LOCATIONS = [
  {
    name:     'The Grand Table — Anna Nagar',
    state:    'Tamil Nadu',
    district: 'Chennai',
    city:     'Anna Nagar',
    address:  '123 3rd Avenue, Anna Nagar, Chennai – 600040',
    phone:    '+91 98765 43210',
    email:    'annagar@thegrandtable.in',
    hours:    '11:00 AM – 11:00 PM'
  },
  {
    name:     'The Grand Table — T. Nagar',
    state:    'Tamil Nadu',
    district: 'Chennai',
    city:     'T. Nagar',
    address:  '45 Usman Road, T. Nagar, Chennai – 600017',
    phone:    '+91 98765 43211',
    email:    'tnagar@thegrandtable.in',
    hours:    '11:00 AM – 11:00 PM'
  },
  {
    name:     'The Grand Table — Coimbatore',
    state:    'Tamil Nadu',
    district: 'Coimbatore',
    city:     'Coimbatore City',
    address:  '78 Race Course Road, Coimbatore – 641018',
    phone:    '+91 98765 43212',
    email:    'coimbatore@thegrandtable.in',
    hours:    '11:00 AM – 10:30 PM'
  },
  {
    name:     'The Grand Table — Madurai',
    state:    'Tamil Nadu',
    district: 'Madurai',
    city:     'Madurai City',
    address:  '12 Meenakshi Nagar, Madurai – 625001',
    phone:    '+91 98765 43213',
    email:    'madurai@thegrandtable.in',
    hours:    '11:00 AM – 10:30 PM'
  },
  {
    name:     'The Grand Table — Trichy',
    state:    'Tamil Nadu',
    district: 'Tiruchirappalli',
    city:     'Trichy City',
    address:  '56 Bharathidasan Road, Trichy – 620001',
    phone:    '+91 98765 43214',
    email:    'trichy@thegrandtable.in',
    hours:    '11:00 AM – 10:00 PM'
  }
];

/* ══════════════════════════════════════════════════════════════
   INIT SUPABASE
══════════════════════════════════════════════════════════════ */
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

/* ══════════════════════════════════════════════════════════════
   UTILITY HELPERS
══════════════════════════════════════════════════════════════ */
function showToast(msg, ms = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms);
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function handleError(error, fallback = 'Something went wrong.') {
  if (!error) return false;
  console.error(error);
  showToast(fallback);
  return true;
}

// Close modal when clicking backdrop
document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

/* ══════════════════════════════════════════════════════════════
   HEADER — Sticky + Scroll Spy
══════════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('mainHeader').classList.toggle('sticky', scrollY > 55);
});

const SPY_IDS = ['home','about','menu','gallery','locators','signature','bestsellers','press','testimonials','articles'];
window.addEventListener('scroll', () => {
  for (const id of SPY_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= 90 && r.bottom >= 90) {
      document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.main-nav a[href="#${id}"]`);
      if (link) link.classList.add('active');
      break;
    }
  }
});

/* ══════════════════════════════════════════════════════════════
   MOBILE NAV
══════════════════════════════════════════════════════════════ */
function openMob() {
  document.getElementById('mobNav').classList.add('open');
  document.getElementById('mobOverlay').classList.add('open');
}
function closeMob() {
  document.getElementById('mobNav').classList.remove('open');
  document.getElementById('mobOverlay').classList.remove('open');
}

/* ══════════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════════ */
function openLB(url) {
  document.getElementById('lb-img').src = url;
  document.getElementById('lightbox').classList.add('open');
}
function closeLB() {
  document.getElementById('lightbox').classList.remove('open');
}

/* ══════════════════════════════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════════════════
   LOGIN POPUP — Shows EVERY time user visits home page
══════════════════════════════════════════════════════════════ */
let currentUser = localStorage.getItem('rg_user_email') || null;

window.addEventListener('load', () => {
  // Always show popup on page load (every visit as required)
  setTimeout(() => openModal('loginModal'), 1500);
  updateLoginBtn();
});

function updateLoginBtn() {
  const btn  = document.getElementById('loginBtn');
  const text = document.getElementById('loginBtnText');
  if (currentUser) {
    text.textContent = currentUser.split('@')[0];
    btn.classList.add('logged');
  } else {
    text.textContent = 'Sign In';
    btn.classList.remove('logged');
  }
}

async function doLogin() {
  const email = document.getElementById('popupEmail').value.trim();
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address.');
    return;
  }
  try {
    await sb.from('customers').upsert({ email }, { onConflict: 'email' });
  } catch (_) {}
  currentUser = email;
  localStorage.setItem('rg_user_email', email);
  updateLoginBtn();
  // Show success message
  document.getElementById('popupBody').innerHTML = `
    <div style="padding:22px 0; text-align:center">
      <i class="fas fa-check-circle" style="font-size:2.6rem; color:var(--gold); display:block; margin-bottom:12px"></i>
      <p style="font-family:var(--font-head); font-size:1.2rem">Welcome!</p>
      <p style="font-size:.84rem; color:var(--muted); margin-top:6px">Enjoy your dining experience.</p>
    </div>`;
  setTimeout(() => closeModal('loginModal'), 1800);
}

function handleHeaderLogin() {
  if (currentUser) {
    if (confirm('Sign out of your account?')) {
      currentUser = null;
      localStorage.removeItem('rg_user_email');
      updateLoginBtn();
      showToast('Signed out successfully.');
    }
  } else {
    openModal('loginModal');
  }
}

/* ══════════════════════════════════════════════════════════════
   MENU — Load from Supabase + Filter by category
══════════════════════════════════════════════════════════════ */
let allMenuItems = [];

async function loadMenu() {
  const { data, error } = await sb
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category');

  if (handleError(error, 'Unable to load menu items.')) {
    renderMenu([]);
    return;
  }

  allMenuItems = data || [];

  const categories = [...new Set(allMenuItems.map(i => i.category))];
  const bar = document.getElementById('catBar');
  bar.innerHTML =
    `<button class="cat-pill active" onclick="filterMenu('all', this)">All</button>` +
    categories.map(c => `<button class="cat-pill" onclick="filterMenu('${c}', this)">${c}</button>`).join('');

  renderMenu(allMenuItems);
}

function renderMenu(items) {
  const grid = document.getElementById('menuGrid');
  if (!items.length) {
    grid.innerHTML = `<p style="text-align:center; color:var(--muted); padding:40px 0; grid-column:span 3">No items found.</p>`;
    return;
  }
  grid.innerHTML = items.map(i => `
    <div class="menu-card reveal">
      <img class="menu-card-img"
           src="${i.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}"
           alt="${i.name}"
           onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'">
      <div class="menu-card-body">
        <p class="menu-card-cat">${i.category}</p>
        <h3 class="menu-card-name">${i.name}</h3>
        <p class="menu-card-desc">${i.description || ''}</p>
        <span class="menu-card-price">₹${Number(i.price).toFixed(0)}</span>
      </div>
    </div>`).join('');
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function filterMenu(cat, btn) {
  document.querySelectorAll('#catBar .cat-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMenu(cat === 'all' ? allMenuItems : allMenuItems.filter(i => i.category === cat));
}

/* ══════════════════════════════════════════════════════════════
   GALLERY — Load from Supabase + Filter by category
══════════════════════════════════════════════════════════════ */
let allGallery = [];

async function loadGallery() {
  const { data, error } = await sb.from('gallery').select('*').order('created_at', { ascending: false });
  if (handleError(error, 'Unable to load gallery images.')) {
    renderGallery([]);
    return;
  }
  allGallery = data || [];
  renderGallery(allGallery);
}

function renderGallery(items) {
  const layouts = ['w2', '', '', 'r2', '', '', 'w2', ''];
  const grid = document.getElementById('galleryGrid');
  if (!items.length) {
    grid.innerHTML = `<p style="text-align:center; color:var(--muted); grid-column:span 4; padding:40px 0">Gallery coming soon.</p>`;
    return;
  }
  grid.innerHTML = items.map((item, i) => `
    <div class="g-item ${layouts[i % layouts.length]}" onclick="openLB('${item.image_url}')">
      <img class="g-img"
           src="${item.image_url}"
           alt="${item.caption || ''}"
           onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80'">
      <div class="g-overlay"><i class="fas fa-expand-alt"></i></div>
    </div>`).join('');
}

function filterGallery(cat, btn) {
  document.querySelectorAll('#gallery .cat-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGallery(cat === 'all' ? allGallery : allGallery.filter(i => i.category === cat));
}

/* ══════════════════════════════════════════════════════════════
   STORE LOCATOR — Cascading dropdowns
══════════════════════════════════════════════════════════════ */
function initLocator() {
  const states = [...new Set(LOCATIONS.map(l => l.state))];
  document.getElementById('selState').innerHTML =
    `<option value="">Select State</option>` +
    states.map(s => `<option value="${s}">${s}</option>`).join('');
}

function onStateChange() {
  const state = document.getElementById('selState').value;
  const distSel = document.getElementById('selDistrict');
  document.getElementById('selCity').innerHTML = '<option value="">Select City</option>';
  if (!state) { distSel.innerHTML = '<option value="">Select District</option>'; return; }
  const districts = [...new Set(LOCATIONS.filter(l => l.state === state).map(l => l.district))];
  distSel.innerHTML = `<option value="">Select District</option>` + districts.map(d => `<option value="${d}">${d}</option>`).join('');
}

function onDistrictChange() {
  const state    = document.getElementById('selState').value;
  const district = document.getElementById('selDistrict').value;
  const citySel  = document.getElementById('selCity');
  if (!district) { citySel.innerHTML = '<option value="">Select City</option>'; return; }
  const cities = LOCATIONS.filter(l => l.state === state && l.district === district).map(l => l.city);
  citySel.innerHTML = `<option value="">Select City</option>` + cities.map(c => `<option value="${c}">${c}</option>`).join('');
}

function findBranch() {
  const state    = document.getElementById('selState').value;
  const district = document.getElementById('selDistrict').value;
  const city     = document.getElementById('selCity').value;

  let results = LOCATIONS;
  if (state)    results = results.filter(l => l.state === state);
  if (district) results = results.filter(l => l.district === district);
  if (city)     results = results.filter(l => l.city === city);

  const el = document.getElementById('branchResults');
  el.style.display = 'block';

  if (!results.length) {
    el.innerHTML = `<p style="text-align:center; color:var(--muted); padding:30px">No branches found in this location.</p>`;
    return;
  }

  el.innerHTML = results.map(b => `
    <div class="branch-card reveal">
      <div>
        <div class="branch-name">${b.name}</div>
        <div class="branch-info">
          <div><i class="fas fa-map-marker-alt"></i>${b.address}</div>
          <div><i class="fas fa-phone"></i>${b.phone}</div>
          <div><i class="fas fa-envelope"></i>${b.email}</div>
          <div><i class="fas fa-clock"></i>${b.hours}</div>
        </div>
      </div>
      <span class="branch-badge">Open</span>
    </div>`).join('');

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ══════════════════════════════════════════════════════════════
   SIGNATURE DISHES — items with is_signature = true
══════════════════════════════════════════════════════════════ */
async function loadSignature() {
  const { data, error } = await sb
    .from('menu_items')
    .select('*')
    .eq('is_signature', true)
    .eq('is_available', true)
    .limit(3);

  const grid = document.getElementById('sigGrid');
  if (handleError(error, 'Unable to load signature dishes.')) {
    grid.innerHTML = `<p style="color:var(--muted); text-align:center; grid-column:span 3; padding:40px 0">Signature dishes coming soon.</p>`;
    return;
  }
  if (!data || !data.length) {
    grid.innerHTML = `<p style="color:var(--muted); text-align:center; grid-column:span 3; padding:40px 0">Signature dishes coming soon.</p>`;
    return;
  }
  grid.innerHTML = data.map(i => `
    <div class="sig-card reveal">
      <img class="sig-img"
           src="${i.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'}"
           alt="${i.name}"
           onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'">
      <h3 class="sig-name">${i.name}</h3>
      <p class="sig-price">₹${Number(i.price).toFixed(0)}</p>
      <p class="sig-desc">${i.description || ''}</p>
    </div>`).join('');
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   BEST SELLERS — items with is_bestseller = true
══════════════════════════════════════════════════════════════ */
async function loadBestSellers() {
  const { data, error } = await sb
    .from('menu_items')
    .select('*')
    .eq('is_bestseller', true)
    .eq('is_available', true)
    .limit(6);

  const grid = document.getElementById('bsGrid');
  if (handleError(error, 'Unable to load best sellers.')) {
    grid.innerHTML = `<p style="color:var(--muted); text-align:center; grid-column:span 2; padding:40px 0">Best sellers coming soon.</p>`;
    return;
  }
  if (!data || !data.length) {
    grid.innerHTML = `<p style="color:var(--muted); text-align:center; grid-column:span 2; padding:40px 0">Best sellers coming soon.</p>`;
    return;
  }
  grid.innerHTML = data.map((i, idx) => `
    <div class="bs-item reveal">
      <span class="bs-rank">0${idx + 1}</span>
      <img class="bs-img"
           src="${i.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'}"
           alt="${i.name}"
           onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'">
      <div>
        <div class="bs-name">${i.name}</div>
        <div class="bs-desc">${i.description || ''}</div>
        <div class="bs-price">₹${Number(i.price).toFixed(0)}</div>
      </div>
    </div>`).join('');
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   PRESS & RECOGNITION
══════════════════════════════════════════════════════════════ */
const PRESS_ICONS = ['fa-award','fa-newspaper','fa-trophy','fa-star','fa-medal','fa-crown'];

async function loadPress() {
  const { data, error } = await sb.from('press').select('*').order('date', { ascending: false }).limit(6);
  const grid = document.getElementById('pressGrid');
  if (handleError(error, 'Unable to load press entries.')) {
    grid.innerHTML = `<p style="color:var(--muted); text-align:center; grid-column:span 3; padding:40px 0">Coming soon.</p>`;
    return;
  }
  if (!data || !data.length) {
    grid.innerHTML = `<p style="color:var(--muted); text-align:center; grid-column:span 3; padding:40px 0">Coming soon.</p>`;
    return;
  }
  grid.innerHTML = data.map((p, i) => `
    <div class="press-card reveal">
      <div class="press-icon"><i class="fas ${PRESS_ICONS[i % PRESS_ICONS.length]}"></i></div>
      <p class="press-pub">${p.publication}</p>
      <h3 class="press-title">${p.title}</h3>
      <p class="press-date">${new Date(p.date).toLocaleDateString('en-IN', { year:'numeric', month:'long' })}</p>
      ${p.link ? `<a class="press-link" href="${p.link}" target="_blank">Read Article →</a>` : ''}
    </div>`).join('');
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS SLIDER
══════════════════════════════════════════════════════════════ */
let sliderIndex = 0;

async function loadTestimonials() {
  const { data } = await sb
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  const track = document.getElementById('sliderTrack');
  if (!data || !data.length) {
    sliderIndex = 0;
    track.innerHTML = `<p style="color:var(--muted); padding:40px 0">No reviews yet.</p>`;
    return;
  }
  sliderIndex = 0;
  track.innerHTML = data.map(r => `
    <div class="t-card">
      <div class="t-quote">"</div>
      <p class="t-text">${r.review}</p>
      <div class="t-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <div class="t-author">
        <div class="t-avatar">${r.customer_name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="t-name">${r.customer_name}</div>
          <div class="t-date">${new Date(r.date || r.created_at).toLocaleDateString('en-IN', { year:'numeric', month:'long' })}</div>
        </div>
      </div>
    </div>`).join('');
  updateSlider();
}

function updateSlider() {
  const track = document.getElementById('sliderTrack');
  const cards  = track.querySelectorAll('.t-card');
  if (!cards.length) return;
  const visible = window.innerWidth < 700 ? 1 : window.innerWidth < 900 ? 2 : 3;
  sliderIndex = Math.max(0, Math.min(sliderIndex, cards.length - visible));
  const cardWidth = cards[0].offsetWidth + 22;
  track.style.transform = `translate3d(-${sliderIndex * cardWidth}px, 0, 0)`;
}

function slide(direction) {
  const track = document.getElementById('sliderTrack');
  const cards  = track.querySelectorAll('.t-card');
  if (!cards.length) return;
  const visible = window.innerWidth < 700 ? 1 : window.innerWidth < 900 ? 2 : 3;
  sliderIndex = Math.max(0, Math.min(sliderIndex + direction, cards.length - visible));
  updateSlider();
}

window.addEventListener('resize', () => {
  updateSlider();
});

/* ══════════════════════════════════════════════════════════════
   FOOD ARTICLES
══════════════════════════════════════════════════════════════ */
async function loadArticles() {
  const { data } = await sb
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(3);

  const grid = document.getElementById('articlesGrid');
  if (!data || !data.length) {
    grid.innerHTML = `<p style="color:var(--muted); text-align:center; grid-column:span 3; padding:40px 0">Articles coming soon.</p>`;
    return;
  }
  grid.innerHTML = data.map(a => `
    <div class="article-card reveal">
      <img class="article-img"
           src="${a.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}"
           alt="${a.title}"
           onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'">
      <div class="article-body">
        <p class="article-cat">${a.category || 'Food Culture'}</p>
        <h3 class="article-title">${a.title}</h3>
        <p class="article-excerpt">${(a.content || '').slice(0, 115)}…</p>
        <div class="article-meta">
          <span><i class="fas fa-user" style="color:var(--gold); margin-right:5px"></i>${a.author || 'Our Team'}</span>
          <span>${new Date(a.published_at).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' })}</span>
        </div>
      </div>
    </div>`).join('');
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   RESERVATION — Submit to Supabase
══════════════════════════════════════════════════════════════ */
async function submitReservation() {
  const name   = document.getElementById('r-name').value.trim();
  const email  = document.getElementById('r-email').value.trim();
  const date   = document.getElementById('r-date').value;
  const time   = document.getElementById('r-time').value;
  const guests = document.getElementById('r-guests').value;
  const notes  = document.getElementById('r-notes').value.trim();

  if (!name || !email || !date || !time || !guests) {
    showToast('Please fill in all required fields.');
    return;
  }

  const { error } = await sb.from('reservations').insert({
    name, email, date, time,
    guests: parseInt(guests),
    special_requests: notes,
    status: 'pending'
  });

  if (error) {
    showToast('Reservation failed. Please check your Supabase setup.');
    return;
  }

  closeModal('resModal');
  showToast('Table reserved! We\'ll confirm via email shortly. 🍽️', 4500);
}

/* ══════════════════════════════════════════════════════════════
   NEWSLETTER — Subscribe to Supabase
══════════════════════════════════════════════════════════════ */
async function subscribeNewsletter() {
  const email = document.getElementById('nlEmail').value.trim();
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address.');
    return;
  }
  await sb.from('newsletter').upsert({ email }, { onConflict: 'email' });
  document.getElementById('nlEmail').value = '';
  showToast('Subscribed! Welcome to our community. 🎉');
}

/* ══════════════════════════════════════════════════════════════
   BOOT — Run everything when DOM is ready
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLocator();
  loadMenu();
  loadGallery();
  loadSignature();
  loadBestSellers();
  loadPress();
  loadTestimonials();
  loadArticles();
});
