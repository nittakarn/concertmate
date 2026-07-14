-- ============================================================
-- ConcertMate AI — Supabase Schema + Seed Data
-- paste ทั้งหมดนี้ใน Supabase → SQL Editor → Run
-- ============================================================


-- ── 1. TABLES ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS concerts (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  venue_name    TEXT NOT NULL,
  venue_query   TEXT NOT NULL,
  door_time     TEXT NOT NULL,
  show_time     TEXT NOT NULL,
  is_outdoor    BOOLEAN NOT NULL DEFAULT FALSE,
  weather_note  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS concert_rounds (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concert_id  TEXT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  key         TEXT NOT NULL,
  label       TEXT NOT NULL,
  date        TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_zones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concert_id  TEXT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  zone        TEXT NOT NULL,
  price       INTEGER NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('VIP','Seated','Standing')),
  color       TEXT NOT NULL,
  perks       TEXT,
  sort_order  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS hotels (
  id              TEXT PRIMARY KEY,
  concert_id      TEXT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  dist            TEXT NOT NULL,
  rating          NUMERIC(2,1) NOT NULL,
  price           INTEGER NOT NULL,
  map_query       TEXT NOT NULL,
  reason          TEXT,
  photo_reference TEXT
);

CREATE TABLE IF NOT EXISTS transit (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concert_id  TEXT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  public      TEXT,
  driving     TEXT,
  grab        TEXT,
  return_note TEXT
);

CREATE TABLE IF NOT EXISTS checklist_extra (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concert_id  TEXT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  pending     BOOLEAN DEFAULT FALSE
);

-- (optional) บันทึกแผนทริปของ user — เปิดใช้เมื่อพร้อมทำ Auth
-- CREATE TABLE IF NOT EXISTS saved_plans (
--   id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--   concert_id      TEXT REFERENCES concerts(id),
--   round_key       TEXT,
--   budget          INTEGER,
--   selected_zone   TEXT,
--   selected_hotel  TEXT,
--   need_hotel      BOOLEAN,
--   hotel_nights    INTEGER,
--   transport_cost  INTEGER DEFAULT 0,
--   merch_cost      INTEGER DEFAULT 0,
--   food_cost       INTEGER DEFAULT 0,
--   other_cost      INTEGER DEFAULT 0,
--   created_at      TIMESTAMPTZ DEFAULT NOW()
-- );


-- ── 2. INDEXES ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_rounds_concert      ON concert_rounds(concert_id);
CREATE INDEX IF NOT EXISTS idx_zones_concert       ON ticket_zones(concert_id);
CREATE INDEX IF NOT EXISTS idx_hotels_concert      ON hotels(concert_id);
CREATE INDEX IF NOT EXISTS idx_transit_concert     ON transit(concert_id);
CREATE INDEX IF NOT EXISTS idx_checklist_concert   ON checklist_extra(concert_id);


-- ── 3. SEED DATA ────────────────────────────────────────────


-- ──────────────────────────────
-- BABYMONSTER
-- ──────────────────────────────
INSERT INTO concerts VALUES (
  'babymonster',
  '2026-27 BABYMONSTER WORLD TOUR [CHOOM]',
  'อิมแพ็ค อารีน่า เมืองทองธานี',
  'Impact Arena Muang Thong Thani',
  '16:30 น.', '18:00 น.', FALSE,
  'พฤศจิกายนเป็นช่วงเปลี่ยนจากฤดูฝนเข้าสู่ฤดูหนาวของกรุงเทพฯ ปริมาณฝนมักลดลงชัดเจนเทียบกับ ก.ย.-ต.ค. กลางวันยังร้อนอบอ้าวได้ ส่วนช่วงค่ำอาจมีลมโกรกเย็นในฮอลล์แอร์ แนะนำพกเสื้อกันหนาวบางๆ ติดตัว และร่มพับสำรองไว้เผื่อฝนหลงฤดู'
);

INSERT INTO concert_rounds (concert_id, key, label, date) VALUES
  ('babymonster', 'sat', 'วันเสาร์ที่ 7 พฤศจิกายน 2569',  '2026-11-07T18:00:00+07:00'),
  ('babymonster', 'sun', 'วันอาทิตย์ที่ 8 พฤศจิกายน 2569', '2026-11-08T18:00:00+07:00');

INSERT INTO ticket_zones (concert_id, zone, price, type, color, perks, sort_order) VALUES
  ('babymonster', 'VIP (V1-V3)',                   7300, 'VIP',      '#38BDF8', 'โซนติดสเตจกลาง สิทธิ์ลุ้นรับชม Soundcheck และ VIP Pass คล้องคอที่ระลึกเฉพาะโซนนี้', 1),
  ('babymonster', 'โซน A (A1-A5)',                  6300, 'Seated',   '#FB923C', 'ที่นั่งกึ่งเวทีชั้นล่าง เกาะขอบระยะประชิด มองเห็นทุกมุมชัด', 2),
  ('babymonster', 'โซน S แดง (SB-SD, SL-SN)',       5800, 'Seated',   '#EF4444', 'ที่นั่งชั้น Level 3 แถวหน้า บรรยากาศดี มองเห็นทั้งเวทีหลัก', 3),
  ('babymonster', 'โซน S น้ำเงิน (SE-SF, SJ-SK)',   5300, 'Seated',   '#3B82F6', 'ที่นั่งกึ่งกลางฮอลล์ ระยะห่างพอดี คุ้มค่าเรื่องมุมมอง', 4),
  ('babymonster', 'โซน SG-SI เหลืองทอง',            4800, 'Seated',   '#EAB308', 'ที่นั่งกลางฮอลล์ตรงหน้าเวที ราคาคุ้มค่าคุ้มราคาสุด', 5),
  ('babymonster', 'Level 4 เขียว (B-E, Q-T)',        3800, 'Seated',   '#22C55E', 'ที่นั่งอัฒจันทร์บนสุด เห็นภาพรวมทั้งฮอลล์ ทะเลแท่งไฟสวยงาม', 6),
  ('babymonster', 'ยืนพื้น/ริมนอก โซนชมพู',        2800, 'Standing', '#EC4899', 'ประหยัดสุด ได้บรรยากาศยืนโบกไปกับเพลง เดินออกง่ายเลี่ยงรถติด', 7);

INSERT INTO hotels VALUES
  ('h1', 'babymonster', 'Novotel Bangkok IMPACT', '0.2 กม. (สกายวอล์กตรงเข้าฮอลล์)', 4.5, 3500, 'Novotel Bangkok Impact', 'เชื่อมสกายวอล์กตรงเข้าประตูฮอลล์ เลี่ยงฝนและรถติดได้เต็มที่ ปลอดภัยที่สุดสำหรับขากลับดึก', NULL),
  ('h2', 'babymonster', 'ibis Bangkok IMPACT',    '0.4 กม.',                           4.2, 1800, 'ibis Bangkok Impact',    'ราคาคุ้มค่าระดับกลาง เดินถึงฮอลล์ได้สบาย ทางเดินมีแสงสว่างดีตลอดคืน', NULL),
  ('h3', 'babymonster', 'Popular Condo Ville (ตึก C3)', '~1.2 กม.',                   3.8,  850, 'Popular Condo Ville Muang Thong Thani', 'ที่พักงบประหยัดที่สุดที่แฟนคอนไปพักกันเป็นประจำ ใกล้ร้านอาหารตึกป๊อปปูล่า', NULL),
  ('h4', 'babymonster', 'Amari Don Muang Airport', '~9.5 กม. (นั่งรถ 20-25 นาที)',    4.8, 2400, 'Amari Don Muang Airport Bangkok', 'รีวิวดีที่สุดในระดับพรีเมียม เหมาะถ้าเดินทางต่อสนามบินดอนเมืองวันรุ่งขึ้น', NULL);

INSERT INTO transit (concert_id, public, driving, grab, return_note) VALUES (
  'babymonster',
  'รถเมล์สาย 166 และ 210 ผ่านหน้าอิมแพ็คตรง หรือต่อรถตู้จากอนุสาวรีย์ชัยสมรภูมิ, เมเจอร์รังสิต, สนามหลวง, BTS หมอชิต/จตุจักร และสีลม',
  'จอดได้ที่ลานจอดฝั่ง Challenger หรือลานจอดหน้าอารีน่า ช่วงเย็นก่อนงานรถจะแน่นเร็ว แนะนำมาถึงก่อนประตูเปิดอย่างน้อย 1 ชม.',
  'ตั้งจุดรับ-ส่งที่ลานจอดฝั่ง Challenger เพื่อเลี่ยงความแน่นหน้าฮอลล์หลัก ขากลับให้เดินออกมาสัก 5-10 นาทีก่อนเรียกรถ',
  'คอนมักเลิกประมาณ 21:00-21:30 น. ถ้าคิวรถแน่นเกินไป แนะนำนั่งรอที่ร้านอาหารโซนตึกป๊อปปูล่าประมาณ 30-60 นาทีให้คนบางลงก่อน'
);


-- ──────────────────────────────
-- POST MALONE
-- ──────────────────────────────
INSERT INTO concerts VALUES (
  'postmalone',
  'Post Malone Presents The BIG ASS Stadium World Tour',
  'ราชมังคลากีฬาสถาน',
  'Rajamangala National Stadium Bangkok',
  '17:00 น.', '19:00 น.', TRUE,
  '22 กันยายนยังอยู่ในช่วงฤดูฝนของกรุงเทพฯ และราชมังคลาเป็นสเตเดียมกลางแจ้ง โอกาสเจอฝนตกช่วงเย็นมีค่อนข้างสูง แนะนำพกร่มพับหรือเสื้อกันฝนแบบพกพาติดตัว'
);

INSERT INTO concert_rounds (concert_id, key, label, date) VALUES
  ('postmalone', 'single', 'วันอังคารที่ 22 กันยายน 2569', '2026-09-22T19:00:00+07:00');

INSERT INTO ticket_zones (concert_id, zone, price, type, color, perks, sort_order) VALUES
  ('postmalone', 'VIP Premium Package (ที่นั่ง E1H-E1L)',    13400, 'VIP',      '#2563EB', 'รวมบัตรที่นั่งโซน E1H/E1I/E1J/E1K/E1L ใกล้เวทีที่สุดในทุกแพ็กเกจ', 1),
  ('postmalone', 'VIP Early Entry Package (ยืน SL/SR)',       12100, 'VIP',      '#EAB308', 'สิทธิ์เข้าคิวโซนยืนก่อนใคร', 2),
  ('postmalone', 'ที่นั่ง E1 (วงในสุด)',                       6800, 'Seated',   '#60A5FA', 'ที่นั่งวงในติดสนาม มองเห็นเวทีชัดที่สุดในกลุ่มที่นั่ง', 3),
  ('postmalone', 'ยืน SL/SR',                                  5500, 'Standing', '#93C5FD', 'โซนยืนหน้าสเตจ ราคาเดียวทั้งฝั่งซ้ายและขวา', 4),
  ('postmalone', 'ที่นั่ง E2 (วงกลาง)',                        4800, 'Seated',   '#3B82F6', 'ที่นั่งวงกลาง คุ้มค่าที่สุดในกลุ่มที่นั่ง', 5),
  ('postmalone', 'ที่นั่ง E3/S1/S2/N1/N2 (วงนอก)',            2800, 'Seated',   '#1E3A8A', 'ที่นั่งวงนอกและฝั่งข้างสนาม ราคาประหยัดที่สุด', 6);

INSERT INTO hotels VALUES
  ('pm1', 'postmalone', 'Baan Thai Boutique',           '~0.72 กม.',  4.8, 3200, 'Baan Thai Boutique Bangkok',           'ที่พักบูทีคระดับ 5 ดาว ใกล้ราชมังคลาที่สุดในลิสต์ เดินถึงสนามได้สบาย', NULL),
  ('pm2', 'postmalone', 'Regent Ramkhamhaeng 22',        '~0.97 กม.', 4.0, 1300, 'Regent Ramkhamhaeng 22 Hotel Bangkok', 'ห้องพักกว้างขวาง มีที่จอดรถเยอะ ใกล้ราชมังคลาเดินทางสะดวก', NULL),
  ('pm3', 'postmalone', 'Livotel Hotel Hua Mak Bangkok', '~1.7 กม.',  4.2, 1600, 'Livotel Hotel Hua Mak Bangkok',        'มีบริการเช็คอินด่วนแม้กลับดึก พร้อมสระว่ายน้ำและฟิตเนส', NULL),
  ('pm4', 'postmalone', 'Mintel Huamark',                '~2 กม.',    4.3,  900, 'Mintel Huamark Hotel Bangkok',         'งบประหยัดที่สุดในลิสต์ ห้องพักดีไซน์โมเดิร์น มีร้านสะดวกซื้อใกล้เคียง', NULL);

INSERT INTO transit (concert_id, public, driving, grab, return_note) VALUES (
  'postmalone',
  'สถานี Airport Link หัวหมาก (A4) ต่อจากพญาไท (BTS) หรือมักกะสัน (MRT) แล้วต่อรถเมล์ 40, 60, 71, 92, 501 หรือวินมอเตอร์ไซค์เข้าสนาม',
  'ที่จอดรถ: เทสโก้ โลตัส บางกะปิ (~1,170 คัน) เดอะมอลล์ บางกะปิ (~3,000 คัน) แนะนำมาก่อนเวลาเพราะรถติดหนักช่วงเลิกงาน',
  'ตั้งจุดรับ-ส่งไว้ที่ห้างใกล้เคียงแทนหน้าสนามตรง เพื่อเลี่ยงความแน่นช่วงคนออกพร้อมกัน',
  'คอนสเตเดียมกลางแจ้งแบบนี้มักเลิกดึกกว่าคอนในฮอลล์ทั่วไป เผื่อแผนสำรองถ้ารถไฟฟ้าปิดก่อนออกจากสนาม'
);

INSERT INTO checklist_extra (concert_id, text, pending) VALUES
  ('postmalone', 'ร่มพับหรือเสื้อกันฝนแบบพกพา (สนามกลางแจ้ง ก.ย. ฝนตกได้ตลอด)', FALSE),
  ('postmalone', 'หมวก/แว่นกันแดดถ้าไปถึงก่อนพระอาทิตย์ตก', FALSE);


-- ──────────────────────────────
-- STRAY KIDS
-- ──────────────────────────────
INSERT INTO concerts VALUES (
  'straykids',
  'STRAY KIDS 5-STAR WORLD TOUR ''domInATE''',
  'อิมแพ็ค อารีน่า เมืองทองธานี',
  'Impact Arena Muang Thong Thani',
  '17:00 น.', '18:30 น.', FALSE,
  'กุมภาพันธ์เป็นช่วงฤดูหนาวกรุงเทพฯ อากาศเย็นสบาย กลางคืนอาจหนาวเล็กน้อยโดยเฉพาะในฮอลล์แอร์ แนะนำพกเสื้อกันหนาวบางๆ ติดตัว ท้องฟ้าส่วนใหญ่แจ่มใสไม่มีฝน'
);

INSERT INTO concert_rounds (concert_id, key, label, date) VALUES
  ('straykids', 'fri', 'วันศุกร์ที่ 6 กุมภาพันธ์ 2570',  '2027-02-06T18:30:00+07:00'),
  ('straykids', 'sat', 'วันเสาร์ที่ 7 กุมภาพันธ์ 2570',  '2027-02-07T18:30:00+07:00');

INSERT INTO ticket_zones (concert_id, zone, price, type, color, perks, sort_order) VALUES
  ('straykids', 'VVIP (แพ็กเกจ V1)',            10500, 'VIP',      '#A855F7', 'แถวหน้าสุด + Soundcheck Experience + VVIP Package กระเป๋าพร้อมสินค้า + Photo Opportunity', 1),
  ('straykids', 'VIP (V2-V4)',                    7500, 'VIP',      '#7C3AED', 'พื้นที่ VIP ติดสเตจ ลุ้น Hi-touch และ VIP Gift Bag เฉพาะโซนนี้', 2),
  ('straykids', 'โซน A ชมพู (A1-A4)',             5800, 'Seated',   '#EC4899', 'ที่นั่งระดับ Floor ใกล้สเตจ มองเห็นสมาชิกได้ชัดทุกคน', 3),
  ('straykids', 'โซน B ส้ม (B1-B6)',              4800, 'Seated',   '#F97316', 'ที่นั่งกึ่งกลาง คุ้มค่าที่สุดในกลุ่มที่นั่ง Floor', 4),
  ('straykids', 'โซน C น้ำเงิน (C1-C8)',          3800, 'Seated',   '#3B82F6', 'ที่นั่งฝั่งข้าง มองเห็นทั้งรูปแบบการแสดงและ Stage setup', 5),
  ('straykids', 'Level 4 เขียว (Upper)',           2800, 'Seated',   '#22C55E', 'มุมสูง เห็นภาพรวมทะเลไฟ STAY ทั้งฮอลล์ บรรยากาศดีมาก', 6),
  ('straykids', 'Standing Pit (หน้าสเตจ)',         3300, 'Standing', '#EF4444', 'โซนยืนหน้าสเตจ ใกล้ที่สุดในบรรดาโซนยืน', 7),
  ('straykids', 'Standing Rear (ด้านหลัง)',        2500, 'Standing', '#F43F5E', 'โซนยืนด้านหลัง ออกงานได้ง่าย ราคาประหยัด', 8);

INSERT INTO hotels VALUES
  ('sk1', 'straykids', 'Novotel Bangkok IMPACT',        '0.2 กม. (สกายวอล์กตรงเข้าฮอลล์)', 4.5, 3500, 'Novotel Bangkok Impact',               'เชื่อมสกายวอล์กตรงเข้าประตูฮอลล์ ไม่ต้องเดินกลางแจ้งกลับดึก', NULL),
  ('sk2', 'straykids', 'ibis Bangkok IMPACT',           '0.4 กม.',                           4.2, 1800, 'ibis Bangkok Impact',                   'คุ้มค่าราคาประหยัด เดินถึงฮอลล์ได้สบาย', NULL),
  ('sk3', 'straykids', 'Popular Condo Ville (ตึก C3)', '~1.2 กม.',                           3.8,  850, 'Popular Condo Ville Muang Thong Thani', 'ที่พักงบน้อยที่สุด แฟนคอน K-pop ไปพักรวมกันที่นี่บ่อยมาก', NULL),
  ('sk4', 'straykids', 'Amari Don Muang Airport',       '~9.5 กม. (20-25 นาที)',              4.8, 2400, 'Amari Don Muang Airport Bangkok',       'รีวิวดีที่สุด เหมาะถ้าต้องบินต่อที่ดอนเมืองวันรุ่งขึ้น', NULL);

INSERT INTO transit (concert_id, public, driving, grab, return_note) VALUES (
  'straykids',
  'รถเมล์สาย 166 และ 210 ผ่านหน้าอิมแพ็คตรง หรือต่อรถตู้จากอนุสาวรีย์ชัยฯ, BTS หมอชิต/จตุจักร ช่วงงาน K-pop รถรับ-ส่งพิเศษมักเปิดเพิ่มเติม ติดตามประกาศจากผู้จัด',
  'จอดได้ที่ลานจอดฝั่ง Challenger หรือลานจอดหน้าอารีน่า คืน K-pop รถเต็มเร็วมาก แนะนำมาก่อนประตูเปิดอย่างน้อย 1.5 ชม.',
  'ตั้งจุดรับ-ส่งที่ลานจอดฝั่ง Challenger ขากลับคิว Grab จะพีคมาก แนะนำรอในร้านอาหารป๊อปปูล่า 30-45 นาทีก่อน',
  'คอน Stray Kids มักเลิกราว 21:00-21:30 น. ถ้ามาสองวัน แนะนำที่พักแถวเมืองทองเพื่อเดินทางสะดวกทั้งสองวัน'
);

INSERT INTO checklist_extra (concert_id, text, pending) VALUES
  ('straykids', 'เสื้อ/ของ Official Merch ที่ซื้อไว้ล่วงหน้า (ลายล่าสุด)', FALSE),
  ('straykids', 'แท่งไฟ STAY สีม่วง ชาร์จแบตเต็มก่อนเข้างาน', FALSE);


-- ──────────────────────────────
-- BRUNO MARS
-- ──────────────────────────────
INSERT INTO concerts VALUES (
  'brunomars',
  'Bruno Mars Live in Bangkok 2027',
  'ราชมังคลากีฬาสถาน',
  'Rajamangala National Stadium Bangkok',
  '16:00 น.', '19:30 น.', TRUE,
  'เมษายนเป็นเดือนที่ร้อนที่สุดของกรุงเทพฯ ราชมังคลาเป็นสเตเดียมกลางแจ้ง กลางวันอุณหภูมิอาจสูงถึง 38-40 องศา แต่ช่วง 19:30 น. อากาศเริ่มเย็นลงบ้าง แนะนำพกน้ำดื่ม ครีมกันแดด และหมวก'
);

INSERT INTO concert_rounds (concert_id, key, label, date) VALUES
  ('brunomars', 'sat', 'วันเสาร์ที่ 10 เมษายน 2570',  '2027-04-10T19:30:00+07:00'),
  ('brunomars', 'sun', 'วันอาทิตย์ที่ 11 เมษายน 2570', '2027-04-11T19:30:00+07:00');

INSERT INTO ticket_zones (concert_id, zone, price, type, color, perks, sort_order) VALUES
  ('brunomars', 'VIP GOLD Package (Floor หน้าสุด)',      15000, 'VIP',      '#EAB308', 'ที่นั่ง Floor ใกล้สเตจที่สุด + Pre-Show Reception + VIP Laminate + Early Entry', 1),
  ('brunomars', 'VIP SILVER (Floor ซ้าย-ขวา)',           11500, 'VIP',      '#94A3B8', 'ที่นั่ง Floor ฝั่งข้าง + Early Entry + Silver Laminate ที่ระลึก', 2),
  ('brunomars', 'ยืน Floor (General)',                    6500, 'Standing', '#FB923C', 'โซนยืนใน Floor ทั้งหมด ใกล้ที่สุดในบรรดาบัตรราคาทั่วไป', 3),
  ('brunomars', 'ที่นั่ง E1 (Lower Bowl ใกล้)',            5500, 'Seated',   '#60A5FA', 'ที่นั่งอัฒจันทร์วงในมองเห็นเวทีระดับสายตาชัดเจน', 4),
  ('brunomars', 'ที่นั่ง E2 (Lower Bowl กลาง)',            4000, 'Seated',   '#38BDF8', 'คุ้มค่าที่สุดในกลุ่มที่นั่ง อัฒจันทร์วงกลางมุมมองดี', 5),
  ('brunomars', 'ที่นั่ง S1/S2/N1/N2 (ฝั่งข้าง)',         2500, 'Seated',   '#6366F1', 'ที่นั่งฝั่งข้างสนาม เห็นเวที runaway และ stage effect ได้ครบ', 6),
  ('brunomars', 'ที่นั่ง E3 (Upper Bowl)',                 1800, 'Seated',   '#1E3A8A', 'ราคาประหยัดที่สุด เห็นภาพรวมสเตเดียมทั้งหมด', 7);

INSERT INTO hotels VALUES
  ('bm1', 'brunomars', 'Baan Thai Boutique',           '~0.72 กม.',  4.8, 3200, 'Baan Thai Boutique Bangkok',           'ที่พักบูทีคระดับพรีเมียม ใกล้ราชมังคลาที่สุด เดินถึงสนามได้สบาย', NULL),
  ('bm2', 'brunomars', 'Livotel Hotel Hua Mak Bangkok', '~1.7 กม.', 4.2, 1600, 'Livotel Hotel Hua Mak Bangkok',        'เช็คอินได้ดึก มีสระว่ายน้ำและฟิตเนส เหมาะพักผ่อนหลังคอนกลางแจ้ง', NULL),
  ('bm3', 'brunomars', 'Regent Ramkhamhaeng 22',        '~0.97 กม.', 4.0, 1300, 'Regent Ramkhamhaeng 22 Hotel Bangkok', 'ห้องกว้างขวาง มีที่จอดรถเยอะ ราคาคุ้มค่าดีสำหรับคอนสเตเดียม', NULL),
  ('bm4', 'brunomars', 'Mintel Huamark',                '~2 กม.',    4.3,  900, 'Mintel Huamark Hotel Bangkok',         'งบน้อยที่สุดแต่ดีไซน์โมเดิร์น มีร้านสะดวกซื้อใกล้เคียง', NULL);

INSERT INTO transit (concert_id, public, driving, grab, return_note) VALUES (
  'brunomars',
  'สถานี Airport Link หัวหมาก (A4) ต่อจากพญาไท (BTS) หรือมักกะสัน (MRT สีน้ำเงิน) แล้วนั่งรถเมล์ 40, 60, 71, 92, 501 หรือวินมอเตอร์ไซค์เข้าสนาม หรือรถไฟฟ้าสายสีเหลือง',
  'ที่จอดรถ: เทสโก้ โลตัส บางกะปิ (~1,170 คัน), เดอะมอลล์ บางกะปิ (~3,000 คัน) คอนเสิร์ต 2 วันรถจะแน่นมาก แนะนำมาก่อนเวลาอย่างน้อย 2 ชม.',
  'ตั้งจุดรับ-ส่งที่ห้างใกล้เคียงแทนหน้าสนาม คิว Grab กลางแจ้งจะพีคกว่าคอนในฮอลล์มาก',
  'คอนสเตเดียมเดือนเมษายน (อากาศร้อน) อาจเลิกดึกกว่าปกติ เผื่อแผนสำรองถ้า Airport Link ปิดก่อนออกจากสนาม'
);

INSERT INTO checklist_extra (concert_id, text, pending) VALUES
  ('brunomars', 'น้ำดื่มขวดเล็กและพัดพกพา (เมษายนร้อนมากก่อนค่ำ)', FALSE),
  ('brunomars', 'ครีมกันแดด SPF50+ และหมวกถ้าไปถึงก่อน 18:00 น.', FALSE),
  ('brunomars', 'ผ้าเย็น/Cooling Spray สำหรับระบายความร้อนในสนาม', FALSE);


-- ── 4. VERIFY ───────────────────────────────────────────────
-- รันบรรทัดนี้เพื่อเช็คว่า insert ครบ
SELECT
  c.id,
  c.name,
  COUNT(DISTINCT r.id) AS rounds,
  COUNT(DISTINCT z.id) AS zones,
  COUNT(DISTINCT h.id) AS hotels
FROM concerts c
LEFT JOIN concert_rounds r  ON r.concert_id = c.id
LEFT JOIN ticket_zones z    ON z.concert_id = c.id
LEFT JOIN hotels h          ON h.concert_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;
