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
    name VARCHAR(100) NOT NULL
);

-- 메뉴 테이블
CREATE TABLE IF NOT EXISTS menus (
    id           BIGSERIAL PRIMARY KEY,
    kor_name     VARCHAR(200) NOT NULL,
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
    src_url    VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 샘플 데이터
-- =============================================

INSERT INTO categories (name) VALUES
    ('커피'),
    ('음료'),
    ('티'),
    ('디저트'),
    ('베이커리')
ON CONFLICT DO NOTHING;

INSERT INTO menus (kor_name, eng_name, description, price, category_id, is_available, sort_order, created_at, updated_at) VALUES
    ('아메리카노',     'Americano',         '진한 에스프레소와 물의 완벽한 조화. 깔끔하고 깊은 맛을 느낄 수 있습니다.',   4500, 1, TRUE, 1, NOW(), NOW()),
    ('카페 라떼',     'Cafe Latte',        '부드러운 우유와 에스프레소의 조화. 고소하고 부드러운 맛이 특징입니다.',        5000, 1, TRUE, 2, NOW(), NOW()),
    ('카푸치노',      'Cappuccino',        '풍성한 우유 거품과 에스프레소의 조화. 부드럽고 크리미한 맛을 즐기세요.',       5500, 1, FALSE,3, NOW(), NOW()),
    ('바닐라 라떼',   'Vanilla Latte',     '달콤한 바닐라 시럽과 에스프레소, 우유의 조화.',                        5500, 1, TRUE, 4, NOW(), NOW()),
    ('카라멜 마끼아또','Caramel Macchiato', '달콤한 카라멜과 에스프레소, 우유의 환상적인 조화.',                     6000, 1, TRUE, 5, NOW(), NOW()),
    ('딸기 스무디',   'Strawberry Smoothie','신선한 딸기로 만든 달콤하고 상큼한 스무디.',                          6000, 2, TRUE, 1, NOW(), NOW()),
    ('레몬에이드',    'Lemonade',          '상큼한 레몬과 탄산수의 청량한 만남.',                                5500, 2, TRUE, 2, NOW(), NOW()),
    ('얼그레이',     'Earl Grey',         '베르가못 향이 은은하게 퍼지는 클래식 홍차.',                           5000, 3, TRUE, 1, NOW(), NOW()),
    ('티라미수',     'Tiramisu',          '에스프레소에 적신 스펀지와 마스카포네 크림의 이탈리안 디저트.',               7000, 4, TRUE, 1, NOW(), NOW()),
    ('크루아상',     'Croissant',         '바삭하고 버터향 가득한 프랑스 정통 크루아상.',                           4000, 5, TRUE, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

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
