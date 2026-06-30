/* ══════════════════════════════════════════════════════════════
   admin.js — Admin Panel JavaScript
   ──────────────────────────────────────────────────────────────
   EDIT SECTION 1 below to configure your Supabase connection
   (use the SAME values as script.js on the customer site)
══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   SECTION 1: SUPABASE CONFIGURATION
══════════════════════════════════════════════════════════════ */
const SUPABASE_URL  = 'https://jwiwollnpjqskthrfnsc.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3aXdvbGxucGpxc2t0aHJmbnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDIwMzcsImV4cCI6MjA5ODM3ODAzN30.9ysuA-JzaKxTs6AZvXNJNAsbRtm9m5mjZOqmyW92BlU';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

/* ══════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════ */
function showToast(msg, ms = 3000) {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms);
}
function openMod(id)  { document.getElementById(id).classList.add('open'); }
function closeMod(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-backdrop').forEach(b => {
  b.addEventListener('click', e => { if (e.target === b) b.classList.remove('open'); });
});
function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' }) : '–';
}
function isValidUrl(value) {
  if (!value) return false;
  try { new URL(value); return true; }
  catch { return false; }
}
/* ══════════════════════════════════════════════════════════════
   TAB SWITCHING
══════════════════════════════════════════════════════════════ */
const TAB_LOADERS = {
  menu: loadMenu, gallery: loadGallery, reviews: loadReviews,
  articles: loadArticles, press: loadPress, reservations: loadReservations,
  newsletter: loadNewsletter, customers: loadCustomers
};

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  document.getElementById('tab-' + tabName).classList.add('active');
  // Highlight matching sidebar link
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.getAttribute('onclick') === `showTab('${tabName}')`) l.classList.add('active');
  });

  if (tabName === 'home') loadStats();
  else if (TAB_LOADERS[tabName]) TAB_LOADERS[tabName]();
}

function quoteForOnclick(obj) {
  return JSON.stringify(obj)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

/* ══════════════════════════════════════════════════════════════
   AUTHENTICATION
   Admin users are created in: Supabase → Authentication → Users
══════════════════════════════════════════════════════════════ */
async function adminLogin() {
  const email = document.getElementById('adminEmail').value.trim();
  const pwd   = document.getElementById('adminPwd').value;
  document.getElementById('authErr').textContent = '';

  const { error } = await sb.auth.signInWithPassword({ email, password: pwd });
  if (error) {
    document.getElementById('authErr').textContent = error.message;
    return;
  }
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('dashboard').style.display   = 'flex';
  loadStats();
}

async function adminLogout() {
  await sb.auth.signOut();
  location.reload();
}

// Auto-login if a session already exists
sb.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('dashboard').style.display   = 'flex';
    loadStats();
  }
});

/* ══════════════════════════════════════════════════════════════
   DASHBOARD STATS
══════════════════════════════════════════════════════════════ */
async function loadStats() {
  const [menu, res, rev, cus] = await Promise.all([
    sb.from('menu_items').select('id', { count: 'exact', head: true }),
    sb.from('reservations').select('id', { count: 'exact', head: true }),
    sb.from('testimonials').select('id', { count: 'exact', head: true }),
    sb.from('customers').select('id', { count: 'exact', head: true }),
  ]);
  document.getElementById('s-menu').textContent = menu.count ?? 0;
  document.getElementById('s-res').textContent  = res.count  ?? 0;
  document.getElementById('s-rev').textContent  = rev.count  ?? 0;
  document.getElementById('s-cus').textContent  = cus.count  ?? 0;
}

/* ══════════════════════════════════════════════════════════════
   MENU ITEMS — Full CRUD
══════════════════════════════════════════════════════════════ */
async function loadMenu() {
  const { data } = await sb.from('menu_items').select('*').order('category');
  const body = document.getElementById('menuBody');
  if (!data || !data.length) {
    body.innerHTML = `<tr><td colspan="8" class="empty">No menu items yet. Click Add Item to create one.</td></tr>`;
    return;
  }
  body.innerHTML = data.map(i => `
    <tr>
      <td><img class="tbl-img" src="${i.image_url || 'https://via.placeholder.com/80?text=No+Image'}" onerror="this.src='https://via.placeholder.com/80?text=Invalid+URL'; this.style.display='inline-block'" alt=""></td>
      <td>${i.name}</td>
      <td>${i.category}</td>
      <td>₹${Number(i.price).toFixed(0)}</td>
      <td><span class="badge ${i.is_available  ? 'badge-yes' : 'badge-no'}">${i.is_available  ? 'Yes' : 'No'}</span></td>
      <td><span class="badge ${i.is_signature  ? 'badge-yes' : 'badge-no'}">${i.is_signature  ? 'Yes' : 'No'}</span></td>
      <td><span class="badge ${i.is_bestseller ? 'badge-yes' : 'badge-no'}">${i.is_bestseller ? 'Yes' : 'No'}</span></td>
      <td><div class="row-actions">
        <button class="action-btn edit"   onclick='editMenu(${quoteForOnclick(i)})'><i class="fas fa-pen"></i></button>
        <button class="action-btn delete" onclick="deleteMenu('${i.id}')"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openMenuModal() {
  document.getElementById('m-id').value = '';
  document.getElementById('menuModalTitle').textContent = 'Add Menu Item';
  document.getElementById('m-name').value  = '';
  document.getElementById('m-cat').value   = '';
  document.getElementById('m-price').value = '';
  document.getElementById('m-desc').value  = '';
  document.getElementById('m-img').value   = '';
  document.getElementById('m-avail').checked = true;
  document.getElementById('m-sig').checked   = false;
  document.getElementById('m-bs').checked    = false;
  openMod('menuModal');
}

function editMenu(item) {
  document.getElementById('m-id').value    = item.id;
  document.getElementById('menuModalTitle').textContent = 'Edit Menu Item';
  document.getElementById('m-name').value  = item.name;
  document.getElementById('m-cat').value   = item.category;
  document.getElementById('m-price').value = item.price;
  document.getElementById('m-desc').value  = item.description || '';
  document.getElementById('m-img').value   = item.image_url || '';
  document.getElementById('m-avail').checked = item.is_available;
  document.getElementById('m-sig').checked   = item.is_signature;
  document.getElementById('m-bs').checked    = item.is_bestseller;
  openMod('menuModal');
}

async function saveMenu() {
  const id  = document.getElementById('m-id').value;
  const imageValue = document.getElementById('m-img').value.trim();
  if (imageValue && !isValidUrl(imageValue)) {
    showToast('Please enter a valid image URL.');
    return;
  }
  const row = {
    name:          document.getElementById('m-name').value.trim(),
    category:      document.getElementById('m-cat').value.trim(),
    price:         parseFloat(document.getElementById('m-price').value),
    description:   document.getElementById('m-desc').value.trim(),
    image_url:     imageValue || null,
    is_available:  document.getElementById('m-avail').checked,
    is_signature:  document.getElementById('m-sig').checked,
    is_bestseller: document.getElementById('m-bs').checked,
  };
  if (!row.name || !row.category || !row.price) {
    showToast('Name, category and price are required.');
    return;
  }
  const { error } = id
    ? await sb.from('menu_items').update(row).eq('id', id)
    : await sb.from('menu_items').insert(row);

  if (error) { showToast('Error: ' + error.message); return; }
  closeMod('menuModal');
  showToast(id ? 'Item updated ✓' : 'Item added ✓');
  loadMenu();
}

async function deleteMenu(id) {
  if (!confirm('Delete this menu item?')) return;
  await sb.from('menu_items').delete().eq('id', id);
  showToast('Deleted.');
  loadMenu();
}

/* ══════════════════════════════════════════════════════════════
   GALLERY — Add / Delete
══════════════════════════════════════════════════════════════ */
async function loadGallery() {
  const { data } = await sb.from('gallery').select('*').order('created_at', { ascending: false });
  const grid = document.getElementById('galAdmGrid');
  if (!data || !data.length) {
    grid.innerHTML = `<p class="empty">No gallery images yet.</p>`;
    return;
  }
  grid.innerHTML = data.map(i => `
    <div class="gal-adm-item">
      <img src="${i.image_url}" alt="" onerror="this.src='https://via.placeholder.com/150'">
      <button class="gal-adm-del" onclick="deleteGallery('${i.id}')"><i class="fas fa-trash"></i></button>
      <span class="gal-adm-cat">${i.category}</span>
    </div>`).join('');
}

function openGalModal() {
  document.getElementById('g-url').value = '';
  document.getElementById('g-cap').value = '';
  openMod('galModal');
}

async function saveGallery() {
  const url = document.getElementById('g-url').value.trim();
  if (!url) { showToast('Image URL is required.'); return; }
  const { error } = await sb.from('gallery').insert({
    image_url: url,
    caption:   document.getElementById('g-cap').value.trim(),
    category:  document.getElementById('g-cat').value
  });
  if (error) { showToast('Error: ' + error.message); return; }
  closeMod('galModal');
  showToast('Image added ✓');
  loadGallery();
}

async function deleteGallery(id) {
  if (!confirm('Remove this image?')) return;
  await sb.from('gallery').delete().eq('id', id);
  showToast('Removed.');
  loadGallery();
}

/* ══════════════════════════════════════════════════════════════
   REVIEWS — CRUD + Approve toggle
══════════════════════════════════════════════════════════════ */
async function loadReviews() {
  const { data } = await sb.from('testimonials').select('*').order('created_at', { ascending: false });
  const body = document.getElementById('revBody');
  if (!data || !data.length) {
    body.innerHTML = `<tr><td colspan="6" class="empty">No reviews yet.</td></tr>`;
    return;
  }
  body.innerHTML = data.map(r => `
    <tr>
      <td>${r.customer_name}</td>
      <td style="max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${r.review}</td>
      <td>${'★'.repeat(r.rating)}</td>
      <td>${fmtDate(r.date || r.created_at)}</td>
      <td><span class="badge ${r.is_approved ? 'badge-yes' : 'badge-pend'}">${r.is_approved ? 'Approved' : 'Pending'}</span></td>
      <td><div class="row-actions">
        <button class="action-btn approve" onclick="toggleApprove('${r.id}', ${r.is_approved})">${r.is_approved ? 'Revoke' : 'Approve'}</button>
        <button class="action-btn edit"    onclick='editReview(${quoteForOnclick(r)})'><i class="fas fa-pen"></i></button>
        <button class="action-btn delete"  onclick="deleteReview('${r.id}')"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

async function toggleApprove(id, current) {
  await sb.from('testimonials').update({ is_approved: !current }).eq('id', id);
  showToast(!current ? 'Approved ✓' : 'Revoked.');
  loadReviews();
}

function openRevModal() {
  document.getElementById('rv-id').value = '';
  document.getElementById('revModalTitle').textContent = 'Add Review';
  document.getElementById('rv-name').value     = '';
  document.getElementById('rv-text').value     = '';
  document.getElementById('rv-rating').value   = '5';
  document.getElementById('rv-date').value     = '';
  document.getElementById('rv-approved').checked = true;
  openMod('revModal');
}

function editReview(r) {
  document.getElementById('rv-id').value       = r.id;
  document.getElementById('revModalTitle').textContent = 'Edit Review';
  document.getElementById('rv-name').value     = r.customer_name;
  document.getElementById('rv-text').value     = r.review;
  document.getElementById('rv-rating').value   = r.rating;
  document.getElementById('rv-date').value     = r.date || '';
  document.getElementById('rv-approved').checked = r.is_approved;
  openMod('revModal');
}

async function saveReview() {
  const id  = document.getElementById('rv-id').value;
  const row = {
    customer_name: document.getElementById('rv-name').value.trim(),
    review:        document.getElementById('rv-text').value.trim(),
    rating:        parseInt(document.getElementById('rv-rating').value),
    date:          document.getElementById('rv-date').value || null,
    is_approved:   document.getElementById('rv-approved').checked
  };
  if (!row.customer_name || !row.review) {
    showToast('Name and review text are required.');
    return;
  }
  const { error } = id
    ? await sb.from('testimonials').update(row).eq('id', id)
    : await sb.from('testimonials').insert(row);

  if (error) { showToast('Error: ' + error.message); return; }
  closeMod('revModal');
  showToast(id ? 'Review updated ✓' : 'Review added ✓');
  loadReviews();
}

async function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  await sb.from('testimonials').delete().eq('id', id);
  showToast('Deleted.');
  loadReviews();
}

/* ══════════════════════════════════════════════════════════════
   ARTICLES — Full CRUD
══════════════════════════════════════════════════════════════ */
async function loadArticles() {
  const { data } = await sb.from('articles').select('*').order('published_at', { ascending: false });
  const body = document.getElementById('artBody');
  if (!data || !data.length) {
    body.innerHTML = `<tr><td colspan="6" class="empty">No articles yet.</td></tr>`;
    return;
  }
  body.innerHTML = data.map(a => `
    <tr>
      <td><img class="tbl-img" src="${a.image_url || ''}" onerror="this.style.display='none'" alt=""></td>
      <td>${a.title}</td>
      <td>${a.category || '–'}</td>
      <td>${a.author || '–'}</td>
      <td>${fmtDate(a.published_at)}</td>
      <td><div class="row-actions">
        <button class="action-btn edit"   onclick='editArticle(${quoteForOnclick(a)})'><i class="fas fa-pen"></i></button>
        <button class="action-btn delete" onclick="deleteArticle('${a.id}')"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openArtModal() {
  document.getElementById('at-id').value = '';
  document.getElementById('artModalTitle').textContent = 'Add Article';
  ['at-title','at-cat','at-author','at-content','at-img','at-date'].forEach(id => document.getElementById(id).value = '');
  openMod('artModal');
}

function editArticle(a) {
  document.getElementById('at-id').value      = a.id;
  document.getElementById('artModalTitle').textContent = 'Edit Article';
  document.getElementById('at-title').value   = a.title;
  document.getElementById('at-cat').value     = a.category || '';
  document.getElementById('at-author').value  = a.author || '';
  document.getElementById('at-content').value = a.content || '';
  document.getElementById('at-img').value     = a.image_url || '';
  document.getElementById('at-date').value    = a.published_at ? a.published_at.slice(0,16) : '';
  openMod('artModal');
}

async function saveArticle() {
  const id  = document.getElementById('at-id').value;
  const row = {
    title:        document.getElementById('at-title').value.trim(),
    category:     document.getElementById('at-cat').value.trim() || 'Food Culture',
    author:       document.getElementById('at-author').value.trim() || 'Our Team',
    content:      document.getElementById('at-content').value.trim(),
    image_url:    document.getElementById('at-img').value.trim(),
    published_at: document.getElementById('at-date').value || new Date().toISOString()
  };
  if (!row.title || !row.content) {
    showToast('Title and content are required.');
    return;
  }
  const { error } = id
    ? await sb.from('articles').update(row).eq('id', id)
    : await sb.from('articles').insert(row);

  if (error) { showToast('Error: ' + error.message); return; }
  closeMod('artModal');
  showToast(id ? 'Article updated ✓' : 'Article added ✓');
  loadArticles();
}

async function deleteArticle(id) {
  if (!confirm('Delete this article?')) return;
  await sb.from('articles').delete().eq('id', id);
  showToast('Deleted.');
  loadArticles();
}

/* ══════════════════════════════════════════════════════════════
   PRESS — Full CRUD
══════════════════════════════════════════════════════════════ */
async function loadPress() {
  const { data } = await sb.from('press').select('*').order('date', { ascending: false });
  const body = document.getElementById('presBody');
  if (!data || !data.length) {
    body.innerHTML = `<tr><td colspan="5" class="empty">No press entries yet.</td></tr>`;
    return;
  }
  body.innerHTML = data.map(p => `
    <tr>
      <td>${p.title}</td>
      <td>${p.publication}</td>
      <td>${fmtDate(p.date)}</td>
      <td>${p.link ? `<a href="${p.link}" target="_blank" style="color:var(--gold); font-size:.76rem">View →</a>` : '–'}</td>
      <td><div class="row-actions">
        <button class="action-btn edit"   onclick='editPress(${quoteForOnclick(p)})'><i class="fas fa-pen"></i></button>
        <button class="action-btn delete" onclick="deletePress('${p.id}')"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openPresModal() {
  document.getElementById('pr-id').value = '';
  document.getElementById('presModalTitle').textContent = 'Add Press Entry';
  ['pr-title','pr-pub','pr-date','pr-link'].forEach(id => document.getElementById(id).value = '');
  openMod('presModal');
}

function editPress(p) {
  document.getElementById('pr-id').value    = p.id;
  document.getElementById('presModalTitle').textContent = 'Edit Entry';
  document.getElementById('pr-title').value = p.title;
  document.getElementById('pr-pub').value   = p.publication;
  document.getElementById('pr-date').value  = p.date || '';
  document.getElementById('pr-link').value  = p.link || '';
  openMod('presModal');
}

async function savePress() {
  const id  = document.getElementById('pr-id').value;
  const row = {
    title:       document.getElementById('pr-title').value.trim(),
    publication: document.getElementById('pr-pub').value.trim(),
    date:        document.getElementById('pr-date').value || null,
    link:        document.getElementById('pr-link').value.trim() || null
  };
  if (!row.title || !row.publication) {
    showToast('Title and publication are required.');
    return;
  }
  const { error } = id
    ? await sb.from('press').update(row).eq('id', id)
    : await sb.from('press').insert(row);

  if (error) { showToast('Error: ' + error.message); return; }
  closeMod('presModal');
  showToast(id ? 'Entry updated ✓' : 'Entry added ✓');
  loadPress();
}

async function deletePress(id) {
  if (!confirm('Delete this press entry?')) return;
  await sb.from('press').delete().eq('id', id);
  showToast('Deleted.');
  loadPress();
}

/* ══════════════════════════════════════════════════════════════
   RESERVATIONS — View + update status
══════════════════════════════════════════════════════════════ */
async function loadReservations() {
  const { data } = await sb.from('reservations').select('*').order('date', { ascending: false });
  const body = document.getElementById('resBody');
  if (!data || !data.length) {
    body.innerHTML = `<tr><td colspan="8" class="empty">No reservations yet.</td></tr>`;
    return;
  }
  body.innerHTML = data.map(r => `
    <tr>
      <td>${r.name}</td>
      <td>${r.email}</td>
      <td>${fmtDate(r.date)}</td>
      <td>${r.time || '–'}</td>
      <td>${r.guests}</td>
      <td style="max-width:160px; font-size:.78rem; color:var(--muted)">${r.special_requests || '–'}</td>
      <td><span class="badge ${r.status === 'confirmed' ? 'badge-conf' : r.status === 'cancelled' ? 'badge-canc' : 'badge-pend'}">${r.status}</span></td>
      <td><div class="row-actions">
        <button class="action-btn status" onclick="updateResStatus('${r.id}','confirmed')">Confirm</button>
        <button class="action-btn delete" onclick="updateResStatus('${r.id}','cancelled')">Cancel</button>
      </div></td>
    </tr>`).join('');
}

async function updateResStatus(id, status) {
  await sb.from('reservations').update({ status }).eq('id', id);
  showToast('Status updated.');
  loadReservations();
}

/* ══════════════════════════════════════════════════════════════
   NEWSLETTER — View + delete
══════════════════════════════════════════════════════════════ */
async function loadNewsletter() {
  const { data } = await sb.from('newsletter').select('*').order('subscribed_at', { ascending: false });
  const body = document.getElementById('nlBody');
  if (!data || !data.length) {
    body.innerHTML = `<tr><td colspan="3" class="empty">No subscribers yet.</td></tr>`;
    return;
  }
  body.innerHTML = data.map(n => `
    <tr>
      <td>${n.email}</td>
      <td>${fmtDate(n.subscribed_at)}</td>
      <td><button class="action-btn delete" onclick="deleteNewsletter('${n.id}')"><i class="fas fa-trash"></i></button></td>
    </tr>`).join('');
}

async function deleteNewsletter(id) {
  if (!confirm('Remove this subscriber?')) return;
  await sb.from('newsletter').delete().eq('id', id);
  showToast('Removed.');
  loadNewsletter();
}

/* ══════════════════════════════════════════════════════════════
   CUSTOMERS — View + delete
══════════════════════════════════════════════════════════════ */
async function loadCustomers() {
  const { data } = await sb.from('customers').select('*').order('created_at', { ascending: false });
  const body = document.getElementById('cusBody');
  if (!data || !data.length) {
    body.innerHTML = `<tr><td colspan="4" class="empty">No customers yet.</td></tr>`;
    return;
  }
  body.innerHTML = data.map(c => `
    <tr>
      <td>${c.email}</td>
      <td>${c.name || '–'}</td>
      <td>${fmtDate(c.created_at)}</td>
      <td><button class="action-btn delete" onclick="deleteCustomer('${c.id}')"><i class="fas fa-trash"></i></button></td>
    </tr>`).join('');
}

async function deleteCustomer(id) {
  if (!confirm('Remove this customer?')) return;
  await sb.from('customers').delete().eq('id', id);
  showToast('Removed.');
  loadCustomers();
}
