-- ============================================================
-- Crimson Luna: Products Table + Seed Data
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  image TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN (
    'pads','tampons','cups','pain-relievers',
    'mood-enhancers','heating-pads','skincare'
  )),
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  is_subscription_available BOOLEAN NOT NULL DEFAULT false,
  subscription_discount INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- 2. Seed all 43 products
INSERT INTO products (id, name, description, price, original_price, image, category, rating, review_count, in_stock, is_subscription_available, subscription_discount, tags)
VALUES
  -- PADS
  ('pad-1', 'Rael Organic Cotton Pads with Wings', 'Certified organic cotton pads with wings. Unscented, chemical-free, and ultra-comfortable for everyday use. 48 count.', 24.99, NULL, 'https://m.media-amazon.com/images/I/71a0pSp0YDL._AC_SL1500_.jpg', 'pads', 4.8, 342, true, true, 15, ARRAY['organic', 'bestseller']),
  ('pad-2', 'Always Maxi Overnight Pads Size 5', 'Extra heavy overnight absorbency pads with wings. LeakGuard core for worry-free sleep protection. 36 count.', 10.97, NULL, 'https://m.media-amazon.com/images/I/81qh0jYD2qL._AC_SL1500_.jpg', 'pads', 4.7, 256, true, true, 15, ARRAY['overnight']),
  ('pad-3', 'Flo Organic Bamboo Panty Liners', 'Ultra-thin organic bamboo daily liners. Wrapped, breathable, biodegradable, and fragrance-free. 24 pack.', 6.99, NULL, 'https://m.media-amazon.com/images/I/71d7rfSzYOL._AC_SL1500_.jpg', 'pads', 4.5, 189, true, true, 10, ARRAY['eco-friendly']),
  ('pad-4', 'Teamoy Reusable Cloth Pads Set (10-Pack)', 'Washable cloth menstrual pads with wet bag. Super-absorbent, soft, eco-friendly. 3 sizes included.', 19.99, 24.99, 'https://m.media-amazon.com/images/I/91mBLz8Y-rL._AC_SL1500_.jpg', 'pads', 4.6, 124, true, false, 0, ARRAY['reusable', 'eco-friendly']),

  -- TAMPONS
  ('tampon-1', 'L. Organic Cotton Tampons - Regular', '100% GOTS certified organic cotton with BPA-free compact applicator. Free from chlorine, pesticides, fragrances. 30 count.', 10.69, NULL, 'https://m.media-amazon.com/images/I/71Md2MhP0wL._AC_SL1500_.jpg', 'tampons', 4.7, 412, true, true, 15, ARRAY['organic', 'bestseller']),
  ('tampon-2', 'L. Organic Cotton Tampons - Super', 'Higher absorbency organic tampons with BPA-free applicator. Designed for heavy flow days. 30 count.', 10.69, NULL, 'https://m.media-amazon.com/images/I/71Md2MhP0wL._AC_SL1500_.jpg', 'tampons', 4.6, 287, true, true, 15, ARRAY['organic']),
  ('tampon-3', 'o.b. Applicator-Free Tampons - Regular', 'The original applicator-free tampon. FLUIDLOCK grooves for up to 8 hours leak protection. Less waste. 40 count.', 6.79, NULL, 'https://m.media-amazon.com/images/I/71LF7GhresL._AC_SL1500_.jpg', 'tampons', 4.4, 156, true, true, 10, ARRAY['eco-friendly']),

  -- CUPS & DISCS
  ('cup-1', 'Saalt Menstrual Cup - Small', 'Medical-grade silicone cup. Comfortable, leak-free protection up to 12 hours. Includes carry bag. Size Small.', 29.99, 32.99, 'https://m.media-amazon.com/images/I/71qCC0KzSXL._AC_SL1500_.jpg', 'cups', 4.8, 523, true, false, 0, ARRAY['bestseller', 'reusable']),
  ('cup-2', 'Saalt Menstrual Cup - Regular', 'Premium medical-grade silicone. #1 active cup. Soft, flexible, reusable. Made in USA. Size Regular.', 29.99, NULL, 'https://m.media-amazon.com/images/I/61xJcNKKLXL._AC_SL1500_.jpg', 'cups', 4.7, 345, true, false, 0, ARRAY['reusable']),
  ('cup-3', 'Softdisc Menstrual Discs (14 Count)', 'Disposable menstrual discs. Capacity of 5 super tampons. Tampon and cup alternative. HSA/FSA eligible.', 13.56, 15.95, 'https://m.media-amazon.com/images/I/71TzR-MwxbL._AC_SL1500_.jpg', 'cups', 4.3, 198, true, true, 10, ARRAY['new']),
  ('cup-4', 'Pixie Cup Sterilizer & Carry Case', 'Collapsible silicone sterilizer for menstrual cups and discs. Microwavable. Reusable and compact.', 11.86, 13.95, 'https://m.media-amazon.com/images/I/71y5FPwYURL._AC_SL1500_.jpg', 'cups', 4.5, 89, true, false, 0, ARRAY['accessory']),

  -- PAIN RELIEVERS
  ('pain-1', 'De Lune Cramp Aid Capsules', 'Herbal formula with fenugreek, dong quai, ginger, zinc & vitamin B. Fast-acting natural period cramp relief. 24 capsules.', 25.00, NULL, 'https://m.media-amazon.com/images/I/71KaFNwexrL._AC_SL1500_.jpg', 'pain-relievers', 4.6, 267, true, true, 15, ARRAY['natural', 'bestseller']),
  ('pain-2', 'HMP Menstrual Cramp Hemp Cream', 'Warming hemp cream 2000MG with menthol, lavender, arnica & magnesium. Topical period pain relief. Made in USA.', 29.99, NULL, 'https://m.media-amazon.com/images/I/71pDhJSxONL._AC_SL1500_.jpg', 'pain-relievers', 4.4, 134, true, false, 0, ARRAY['natural']),
  ('pain-3', 'Traditional Medicinals Raspberry Leaf Tea', 'Organic herbal tea that eases menstrual cramps. Caffeine-free, Non-GMO, Fair Wild certified. 16 tea bags.', 4.67, NULL, 'https://m.media-amazon.com/images/I/81dYOsuJfBL._AC_SL1500_.jpg', 'pain-relievers', 4.5, 312, true, true, 10, ARRAY['natural', 'tea']),

  -- MOOD ENHANCERS
  ('mood-1', 'O Positiv FLO PMS Gummies', 'Proactive PMS relief with chasteberry, vitamin B6, dong quai & lemon balm. Targets bloating, cramps & mood swings.', 29.99, 31.99, 'https://m.media-amazon.com/images/I/71kx2vSVURL._AC_SL1500_.jpg', 'mood-enhancers', 4.5, 234, true, true, 15, ARRAY['bestseller']),
  ('mood-2', 'Plant Therapy Lavender Roll-On', '100% pure lavender essential oil, pre-diluted with fractionated coconut oil. Therapeutic grade. 10 mL roll-on.', 9.49, NULL, 'https://m.media-amazon.com/images/I/61pHDNBgKNL._AC_SL1500_.jpg', 'mood-enhancers', 4.7, 178, true, false, 0, ARRAY['aromatherapy']),
  ('mood-3', 'Cycle Tracking Journal by Alina Mae', 'Discreet menstrual cycle planner. Monthly calendar for tracking phases, symptoms, flow & pain. Undated format.', 9.99, NULL, 'https://m.media-amazon.com/images/I/61mIq-oTURL._SL1500_.jpg', 'mood-enhancers', 4.8, 156, true, false, 0, ARRAY['self-care']),

  -- HEATING PADS
  ('heat-1', 'Pixie Wearable Heating Pad for Cramps', 'Thinnest wearable heating pad. Unnoticeable under clothes. Portable heat belt for menstrual pain relief. FSA/HSA eligible.', 28.99, 35.99, 'https://m.media-amazon.com/images/I/71g5KBvEWnL._AC_SL1500_.jpg', 'heating-pads', 4.7, 389, true, false, 0, ARRAY['bestseller', 'tech']),
  ('heat-2', 'Sonoma Lavender Spa Heat Wrap', 'Microwaveable lavender aromatherapy heating pad. Removable & washable cover. Moist heat for neck, shoulders & back.', 19.99, NULL, 'https://m.media-amazon.com/images/I/81vRBvXJURL._AC_SL1500_.jpg', 'heating-pads', 4.6, 213, true, false, 0, ARRAY['aromatherapy']),
  ('heat-3', 'Rael Herbal Heating Patches (8-Pack)', 'Adhesive herbal heat patches for period cramps. Ultra thin, on-the-go relief. Lasts up to 8 hours each.', 11.99, NULL, 'https://m.media-amazon.com/images/I/71BH1IgFtdL._AC_SL1500_.jpg', 'heating-pads', 4.4, 167, true, true, 10, ARRAY['portable']),

  -- SKINCARE
  ('skin-1', 'The Ordinary Niacinamide 10% + Zinc 1%', 'Smoothing serum for blemish-prone skin. Targets oiliness, pores & uneven tone. 1 fl oz.', 6.00, NULL, 'https://m.media-amazon.com/images/I/61GdmlfP0GL._SL1500_.jpg', 'skincare', 4.6, 198, true, true, 15, ARRAY['new', 'bestseller']),
  ('skin-2', 'TreeActiv Acne Spot Treatment', 'Salicylic acid & tea tree oil clear-drying formula for hormonal and cystic acne. 150+ uses. 0.5 fl oz.', 18.99, NULL, 'https://m.media-amazon.com/images/I/81EVdJ2g9pL._SL1500_.jpg', 'skincare', 4.5, 234, true, false, 0, ARRAY['treatment']),
  ('skin-3', 'DERMAL Rose Collagen Sheet Masks (10-Pack)', 'Refreshing & moisturizing sheet masks with rose essence and collagen. Calming daily skin treatment.', 9.99, NULL, 'https://m.media-amazon.com/images/I/61JNiR4vJkL._SL1200_.jpg', 'skincare', 4.7, 145, true, true, 10, ARRAY['self-care']),
  ('skin-4', 'De Selva Anti-Cellulite Massage Oil', 'Firming body oil with juniper, grapefruit & black pepper. Circulation & lymphatic support. 4 oz.', 18.99, NULL, 'https://m.media-amazon.com/images/I/71pZzQ5YzNL._SL1500_.jpg', 'skincare', 4.3, 87, true, false, 0, ARRAY['massage'])
ON CONFLICT (id) DO NOTHING;

-- 3. Add foreign key from cart_items to products (run AFTER seeding)
ALTER TABLE cart_items
  ADD CONSTRAINT cart_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
