-- =============================================
-- NCafe DB 초기화 스크립트 (woohyuk)
-- =============================================

-- 유저 테이블 (로그인 인증용)
CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(500) NOT NULL,  -- TODO: BCrypt 등 해시 알고리즘으로 저장
    role          VARCHAR(50) DEFAULT 'ADMIN',
    created_at    TIMESTAMP DEFAULT NOW()
);

-- 카테고리 테이블
CREATE TABLE IF NOT EXISTS categories (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 메뉴 테이블
CREATE TABLE IF NOT EXISTS menus (
    id           BIGSERIAL PRIMARY KEY,
    kor_name     VARCHAR(200) UNIQUE NOT NULL,
    eng_name     VARCHAR(200),
    description  TEXT,
    price        INTEGER,
    category_id  BIGINT REFERENCES categories(id),
    is_available BOOLEAN DEFAULT TRUE,
    sort_order   INTEGER DEFAULT 1,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

-- 메뉴 이미지 테이블
CREATE TABLE IF NOT EXISTS menu_images (
    id         BIGSERIAL PRIMARY KEY,
    menu_id    BIGINT REFERENCES menus(id) ON DELETE CASCADE,
    src_url    VARCHAR(500) UNIQUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 샘플 데이터 (초기화 및 중복 제거 멱등성 보장)
-- =============================================

-- 라이브 DB 공간에 잘못 쌓인 중복 데이터를 삭제하기 위해 강제 TRUNCATE 수행 (새로운 배포 시 깨끗하게 덮어쓰기)
TRUNCATE TABLE order_items, menu_images, menus CASCADE;
TRUNCATE TABLE categories CASCADE;

ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE menus_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_images_id_seq RESTART WITH 1;

INSERT INTO categories (name) VALUES 
    ('커피'), ('음료'), ('티'), ('디저트'), ('베이커리'), ('샌드위치');

INSERT INTO menus (kor_name, eng_name, description, price, category_id, is_available, sort_order) VALUES
    ('아메리카노', 'Americano', '아메리카노의 깊고 진한 맛을 느껴보세요.', 4500, 1, TRUE, 1),
    ('카페 라떼', 'Cafe Latte', '카페 라떼의 깊고 진한 맛을 느껴보세요.', 5000, 1, TRUE, 2),
    ('카푸치노', 'Cappuccino', '카푸치노의 깊고 진한 맛을 느껴보세요.', 5500, 1, TRUE, 3),
    ('바닐라 라떼', 'Vanilla Latte', '바닐라 라떼의 깊고 진한 맛을 느껴보세요.', 5500, 1, TRUE, 4),
    ('카라멜 마끼아또', 'Caramel Macchiato', '카라멜 마끼아또의 깊고 진한 맛을 느껴보세요.', 6000, 1, TRUE, 5),
    ('에스프레소', 'Espresso', '에스프레소의 깊고 진한 맛을 느껴보세요.', 4000, 1, TRUE, 6),
    ('플랫화이트', 'Flat White', '플랫화이트의 깊고 진한 맛을 느껴보세요.', 5000, 1, TRUE, 7),
    ('헤이즐넛 라떼', 'Hazelnut Latte', '헤이즐넛 라떼의 깊고 진한 맛을 느껴보세요.', 5500, 1, TRUE, 8),
    ('마끼아또', 'Macchiato', '마끼아또의 깊고 진한 맛을 느껴보세요.', 5500, 1, TRUE, 9),
    ('라떼', 'Latte', '라떼의 깊고 진한 맛을 느껴보세요.', 5000, 1, TRUE, 10),
    ('시그니처 로스터리', 'Signature', '시그니처 로스터리의 깊고 진한 맛을 느껴보세요.', 6500, 1, TRUE, 11),
    ('초코 라떼', 'Chocolate Latte', '초코 라떼의 깊고 진한 맛을 느껴보세요.', 5500, 2, TRUE, 12),
    ('녹차 라떼', 'Green Tea Latte', '녹차 라떼의 깊고 진한 맛을 느껴보세요.', 5500, 2, TRUE, 13),
    ('바나나 라떼', 'Banana Latte', '바나나 라떼의 깊고 진한 맛을 느껴보세요.', 5500, 2, TRUE, 14),
    ('딸기 스무디', 'Strawberry Smoothie', '딸기 스무디의 깊고 진한 맛을 느껴보세요.', 6000, 2, TRUE, 15),
    ('프라푸치노', 'Frappuccino', '프라푸치노의 깊고 진한 맛을 느껴보세요.', 6500, 2, TRUE, 16),
    ('레몬에이드', 'Lemonade', '레몬에이드의 깊고 진한 맛을 느껴보세요.', 5500, 2, TRUE, 17),
    ('아이스티', 'Iced Tea', '아이스티의 깊고 진한 맛을 느껴보세요.', 4500, 3, TRUE, 18),
    ('얼그레이', 'Earl Grey', '얼그레이의 깊고 진한 맛을 느껴보세요.', 5000, 3, TRUE, 19),
    ('티라미수', 'Tiramisu', '티라미수의 깊고 진한 맛을 느껴보세요.', 7000, 4, TRUE, 20),
    ('딸기 케이크', 'Strawberry Cake', '딸기 케이크의 깊고 진한 맛을 느껴보세요.', 7500, 4, TRUE, 21),
    ('초코 무스', 'Chocolate Mousse', '초코 무스의 깊고 진한 맛을 느껴보세요.', 7000, 4, TRUE, 22),
    ('아몬드 쿠키', 'Almond Cookie', '아몬드 쿠키의 깊고 진한 맛을 느껴보세요.', 3500, 5, TRUE, 23),
    ('버터 쿠키', 'Butter Cookie', '버터 쿠키의 깊고 진한 맛을 느껴보세요.', 3000, 5, TRUE, 24),
    ('초코칩 쿠키', 'Choco Chip Cookie', '초코칩 쿠키의 깊고 진한 맛을 느껴보세요.', 3500, 5, TRUE, 25),
    ('두바이 쫀득 쿠키', 'Dubai Cookie', '두바이 쫀득 쿠키의 깊고 진한 맛을 느껴보세요.', 4500, 5, TRUE, 26),
    ('두바이 쿠키 오리지널', 'Dubai Original', '두바이 쿠키 오리지널의 깊고 진한 맛을 느껴보세요.', 4500, 5, TRUE, 27),
    ('초코 크루아상', 'Choco Croissant', '초코 크루아상의 깊고 진한 맛을 느껴보세요.', 4800, 5, TRUE, 28),
    ('베이글 & 크림치즈', 'Bagel & Cream', '베이글 & 크림치즈의 깊고 진한 맛을 느껴보세요.', 4500, 5, TRUE, 29),
    ('비프 베이글', 'Beef Bagel', '비프 베이글의 깊고 진한 맛을 느껴보세요.', 6500, 6, TRUE, 30),
    ('햄치즈 샌드위치', 'Ham Cheese Sandwich', '햄치즈 샌드위치의 깊고 진한 맛을 느껴보세요.', 6000, 6, TRUE, 31),
    ('참치 샌드위치', 'Tuna Sandwich', '참치 샌드위치의 깊고 진한 맛을 느껴보세요.', 6500, 6, TRUE, 32),
    ('터키 샌드위치', 'Turkey Sandwich', '터키 샌드위치의 깊고 진한 맛을 느껴보세요.', 7000, 6, TRUE, 33),
    ('스크램블 에그 샌드위치', 'Egg Sandwich', '스크램블 에그 샌드위치의 깊고 진한 맛을 느껴보세요.', 6500, 6, TRUE, 34);

INSERT INTO menu_images (menu_id, src_url, sort_order) VALUES
    (1, 'americano.png', 1),
    (1, 'americano1.png', 2),
    (1, 'americano copy.png', 3),
    (1, 'americano1 copy.png', 4),
    (2, 'cafelatte.png', 1),
    (2, 'cafelatte1.png', 2),
    (2, 'cafelatte copy.png', 3),
    (3, 'capuchino.png', 1),
    (3, 'capuchino1.png', 2),
    (3, 'capuchino copy.png', 3),
    (4, 'vanilla-latte.png', 1),
    (5, 'caramel-macchiato.png', 1),
    (5, 'caramel-macchiato1.png', 2),
    (6, 'espresso.png', 1),
    (6, 'espresso1.png', 2),
    (6, 'espresso copy.png', 3),
    (7, 'flatwhite.png', 1),
    (8, 'hazelnutlatte.png', 1),
    (9, 'macchiato.png', 1),
    (9, 'caramel-macchiato.png', 2),
    (9, 'caramel-macchiato1.png', 3),
    (10, 'latte.png', 1),
    (10, 'cafelatte.png', 2),
    (10, 'cafelatte1.png', 3),
    (10, 'bananalatte.png', 4),
    (10, 'bananalatte1.png', 5),
    (10, 'hazelnutlatte.png', 6),
    (10, 'vanilla-latte.png', 7),
    (10, 'greentealatte.png', 8),
    (10, 'chocolatelatte.png', 9),
    (10, 'cafelatte copy.png', 10),
    (10, 'bananalatte copy.png', 11),
    (11, 'signature.png', 1),
    (11, 'signature1.png', 2),
    (12, 'chocolatelatte.png', 1),
    (13, 'greentealatte.png', 1),
    (14, 'bananalatte.png', 1),
    (14, 'bananalatte1.png', 2),
    (14, 'bananalatte copy.png', 3),
    (15, 'strawberrysmoothie.png', 1),
    (16, 'frappuccino.png', 1),
    (17, 'lemonade.png', 1),
    (18, 'icedtea.png', 1),
    (19, 'earl-grey.png', 1),
    (20, 'tiramisu.png', 1),
    (21, 'strawberry-cake.png', 1),
    (21, 'strawberry-cake1.png', 2),
    (22, 'chocolate-mousse.png', 1),
    (22, 'chocolate-mousse1.png', 2),
    (23, 'almond-cookie.png', 1),
    (23, 'almond-cookie1.png', 2),
    (24, 'butter-cookie.png', 1),
    (24, 'butter-cookie1.png', 2),
    (25, 'choco-chip-cookie.png', 1),
    (25, 'choco-chip-cookie1.png', 2),
    (25, 'choco-chip-cookie1 copy.png', 3),
    (26, 'dubai-zzondeuk-cookie.png', 1),
    (26, 'dubai-zzondeuk-cookie1.png', 2),
    (27, 'DubaiZzondeukCookie.png', 1),
    (28, 'chocolate-croissant.png', 1),
    (28, 'chocolate-croissant1.png', 2),
    (29, 'bagel-cream-cheese.png', 1),
    (29, 'bagel-cream-cheese1.png', 2),
    (30, 'beef-bagel.png', 1),
    (30, 'beef-bagel1.png', 2),
    (31, 'ham-cheese-sandwich.png', 1),
    (31, 'ham-cheese-sandwich1.png', 2),
    (32, 'tuna-sandwich.png', 1),
    (32, 'tuna-sandwich1.png', 2),
    (33, 'turkey-sandwich.png', 1),
    (33, 'turkey-sandwich1.png', 2),
    (34, 'scrambled-egg-sandwich.png', 1),
    (34, 'scrambled-egg-sandwich1.png', 2);

-- 주문 테이블 (비회원 주문 허용: user_id NULLABLE)
CREATE TABLE IF NOT EXISTS orders (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id),   -- NULL 허용 (비회원)
    guest_name      VARCHAR(100),                  -- 비회원 주문자명
    guest_phone     VARCHAR(20),                   -- 비회원 연락처
    total_price     INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, PREPARING, READY, COMPLETED, CANCELLED
    payment_method  VARCHAR(50),                   -- CARD, CASH, KAKAO_PAY 등
    payment_status  VARCHAR(50) DEFAULT 'UNPAID',  -- UNPAID, PAID, REFUNDED
    memo            TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- 주문 항목 테이블
CREATE TABLE IF NOT EXISTS order_items (
    id         BIGSERIAL PRIMARY KEY,
    order_id   BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    menu_id    BIGINT REFERENCES menus(id),
    menu_name  VARCHAR(200) NOT NULL,              -- 주문 시점 메뉴명 스냅샷
    price      INTEGER NOT NULL,                    -- 주문 시점 가격 스냅샷
    quantity   INTEGER NOT NULL DEFAULT 1,
    options    TEXT,                                 -- 옵션 정보 (JSON)
    created_at TIMESTAMP DEFAULT NOW()
);
