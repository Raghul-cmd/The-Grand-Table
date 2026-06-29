-- ╔══════════════════════════════════════════════════════════════════╗
-- ║   RESTAURANT WEBSITE — SUPABASE SQL SCHEMA                     ║
-- ║   Run this ONCE in: Supabase → SQL Editor → New Query          ║
-- ║   Then click RUN                                                ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- ════════════════════════════════════════
--  TABLE 1: CUSTOMERS (login popup data)
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS customers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  TABLE 2: MENU ITEMS
--  is_signature  → shows in Signature Dishes section
--  is_bestseller → shows in Best Sellers section
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL,
  category     TEXT NOT NULL,        -- e.g. 'Starters', 'Main Course', 'Desserts'
  image_url    TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  is_signature BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  TABLE 3: GALLERY
--  category → 'store' or 'infrastructure'
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS gallery (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url  TEXT NOT NULL,
  caption    TEXT,
  category   TEXT DEFAULT 'store',   -- 'store' or 'infrastructure'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  TABLE 4: TESTIMONIALS (Customer Reviews)
--  is_approved → only approved reviews show on site
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS testimonials (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  review        TEXT NOT NULL,
  rating        INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  date          DATE DEFAULT CURRENT_DATE,
  is_approved   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  TABLE 5: ARTICLES (Food Blog)
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS articles (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  content      TEXT,
  image_url    TEXT,
  author       TEXT DEFAULT 'Our Team',
  category     TEXT DEFAULT 'Food Culture',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  TABLE 6: PRESS & RECOGNITION
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS press (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  publication TEXT NOT NULL,
  date        DATE DEFAULT CURRENT_DATE,
  link        TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  TABLE 7: RESERVATIONS
--  status → 'pending', 'confirmed', 'cancelled'
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reservations (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  date             DATE NOT NULL,
  time             TIME NOT NULL,
  guests           INTEGER NOT NULL,
  special_requests TEXT,
  status           TEXT DEFAULT 'pending',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  TABLE 8: NEWSLETTER SUBSCRIBERS
-- ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS newsletter (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
--  Customer site = anon reads + inserts
--  Admin site    = full access (authenticated)
-- ════════════════════════════════════════
ALTER TABLE customers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery      ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE press        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter   ENABLE ROW LEVEL SECURITY;

-- ── PUBLIC READ (customer site can display) ──
CREATE POLICY "public_read_menu"     ON menu_items   FOR SELECT USING (true);
CREATE POLICY "public_read_gallery"  ON gallery      FOR SELECT USING (true);
CREATE POLICY "public_read_reviews"  ON testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "public_read_articles" ON articles     FOR SELECT USING (true);
CREATE POLICY "public_read_press"    ON press        FOR SELECT USING (true);

-- ── PUBLIC INSERT (customer actions) ──
CREATE POLICY "public_insert_customers"     ON customers    FOR INSERT WITH CHECK (true);
CREATE POLICY "public_upsert_customers"     ON customers    FOR UPDATE USING (true);
CREATE POLICY "public_insert_reservations"  ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_newsletter"    ON newsletter   FOR INSERT WITH CHECK (true);
CREATE POLICY "public_upsert_newsletter"    ON newsletter   FOR UPDATE USING (true);
CREATE POLICY "public_insert_reviews"       ON testimonials FOR INSERT WITH CHECK (true);

-- ── ADMIN FULL ACCESS (authenticated Supabase users) ──
CREATE POLICY "admin_all_menu"         ON menu_items   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_gallery"      ON gallery      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_reviews"      ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_articles"     ON articles     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_press"        ON press        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_reservations" ON reservations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_newsletter"   ON newsletter   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_customers"    ON customers    FOR ALL USING (auth.role() = 'authenticated');

-- ════════════════════════════════════════
--  SAMPLE DATA (delete or edit these)
-- ════════════════════════════════════════
INSERT INTO menu_items (name, description, price, category, image_url, is_available, is_signature, is_bestseller) VALUES
('Butter Chicken',     'Rich creamy tomato curry with tender chicken',         450, 'Main Course', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', true, true,  true),
('Dal Makhani',        'Slow-cooked black lentils with butter and cream',       320, 'Main Course', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', true, false, true),
('Tandoori Platter',   'Assorted tandoor specialties with mint chutney',        680, 'Starters',   'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', true, true,  false),
('Royal Biryani',      'Aromatic saffron basmati rice with slow-cooked meat',   550, 'Rice',       'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', true, true,  true),
('Paneer Tikka',       'Marinated cottage cheese grilled in tandoor',           380, 'Starters',   'https://images.unsplash.com/photo-1567188040759-fb8a254b6756?w=400', true, false, true),
('Gulab Jamun',        'Soft milk dumplings in rose-flavored sugar syrup',      180, 'Desserts',   'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true, false, true);

INSERT INTO testimonials (customer_name, review, rating, date, is_approved) VALUES
('Priya Sharma',   'The finest dining experience in Chennai. Every dish was a masterpiece — the ambiance, the service, all perfect.', 5, '2024-11-15', true),
('Raj Kumar',      'Came for our anniversary. The Signature Biryani was out of this world! Staff were incredibly attentive.', 5, '2024-10-20', true),
('Anitha Krishnan','Absolutely divine from start to finish. The Tandoori Platter was perfectly seasoned and the desserts heavenly.', 5, '2024-09-10', true);

INSERT INTO press (title, publication, date) VALUES
('Best Fine Dining Restaurant 2024',    'Times Food Awards',       '2024-03-15'),
('Top 10 Restaurants in South India',   'Condé Nast Traveller IN', '2024-01-20'),
('Michelin-Worthy Dining in Chennai',   'Food & Wine India',       '2023-11-05');

INSERT INTO articles (title, content, author, category, image_url, published_at) VALUES
('The Art of Indian Spice Blending',
 'Discover how our chefs masterfully blend over 30 spices to create the perfect balance of flavours. From earthy cumin to aromatic cardamom, every spice tells a story of culture and tradition.',
 'Chef Arjun Nair', 'Culinary Arts',
 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=400',
 NOW() - INTERVAL '5 days'),
('Farm to Table: Our Ingredient Philosophy',
 'We believe the finest cuisine begins with the finest ingredients. Learn about our relationships with local farmers and how we ensure every dish uses only the freshest, most sustainable produce.',
 'Preethi Menon', 'Food Culture',
 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
 NOW() - INTERVAL '12 days'),
('The Secret Behind Our Royal Biryani',
 'Our Royal Biryani has been perfected over 14 years. Slow-cooked for 4 hours with saffron, whole spices, and the finest basmati — here is the story behind this legendary dish.',
 'Chef Arjun Nair', 'Chef Stories',
 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
 NOW() - INTERVAL '20 days');

-- ════════════════════════════════════════
--  HOW TO SET UP YOUR ADMIN LOGIN
--
--  1. Go to Supabase → Authentication → Users
--  2. Click "Add User" → Enter admin email + password
--  3. Use those credentials on admin.html to log in
--  4. That's it — no extra table needed!
-- ════════════════════════════════════════
