# Abir Sport - Gym Simulator Web App
# אביר ספורט - סימולטור חדר כושר | מסמך תכנון מפורט

---

## 1. סקירת הפרויקט (Project Overview)

### חזון
בניית וובאפ אינטראקטיבי תלת-ממדי (3D) שמאפשר ללקוחות, בעלי חדרי כושר וצוות המכירות של אביר ספורט לתכנן ולעצב חדרי כושר וירטואליים. המשתמש בוחר מכשירי כושר מתוך קטלוג המוצרים של אביר ספורט, ממקם אותם בחדר תלת-ממדי בהתאם למידות שהוא מגדיר, ומקבל הצעת מחיר אוטומטית.

### לקוח
**אביר ספורט בע"מ** — חברה ישראלית ותיקה (20+ שנים) ליבוא ושיווק ציוד כושר מקצועי.
- כתובת: שביל התנופה 6, תל אביב
- טלפון: 03-5186372
- אתר: https://www.abirsport.co.il

### לוח זמנים
**MVP: 1-2 חודשים** — גרסה ראשונה עובדת עם פיצ'רים מרכזיים

---

## 2. קהל יעד (Target Audience)

| קהל | צורך | שימוש עיקרי |
|-----|------|-------------|
| **בעלי חדרי כושר** | תכנון חדר כושר חדש או שידרוג קיים | בניית סימולציה, קבלת הצעת מחיר |
| **צוות מכירות אביר ספורט** | הדגמת מכשירים ללקוחות, בניית הצעות מחיר | יצירת עיצובים מוכנים, שיתוף עם לקוחות |
| **משתמשי קצה (פרטיים)** | תכנון חדר כושר ביתי | בחירת מכשירים, בדיקת התאמה למידות החדר |

---

## 3. פיצ'רים (Features)

### 3.1 MVP - גרסה ראשונה (Phase 1)

#### 🏗️ סימולטור חדר 3D
- הגדרת מידות חדר מותאמות אישית (אורך × רוחב × גובה) במטרים
- תצוגה תלת-ממדית אינטראקטיבית של החדר
- סיבוב, זום, ופאן (Pan) חופשי במרחב
- רצפה, קירות ותאורה בסיסית
- תצוגת Grid על הרצפה לעזרה במיקום

#### 🏋️ קטלוג מכשירים
- קטלוג מכשירים מחולק לקטגוריות (בהתאם לאתר אביר ספורט)
- תמונת מוצר, שם, מחיר, ומידות
- חיפוש וסינון לפי קטגוריה/מותג/מחיר
- גרירת מכשיר (Drag & Drop) מהקטלוג לתוך החדר

#### 📐 מיקום והתאמה
- גרירה חופשית של מכשירים בתוך החדר
- סיבוב מכשירים (rotation)
- זיהוי התנגשויות (collision detection) - התראה כשמכשיר חוסם מכשיר אחר
- Snap to Grid - הצמדה לרשת

#### 💰 הצעת מחיר אוטומטית
- טבלה על המסך עם פירוט כל המכשירים שנבחרו
- שם המוצר, כמות, מחיר ליחידה, סה"כ לשורה
- סכום כולל של כל המכשירים
- אפשרות להוסיף/להסיר פריטים ישירות מהטבלה

#### 💾 שמירה ושיתוף
- שמירת העיצוב (Local + Supabase)
- שיתוף עיצוב דרך קישור ייחודי
- שליחה במייל (אופציונלי ב-MVP)

### 3.2 שיפורים עתידיים (Phase 2)
- ייצוא הצעת מחיר ל-PDF מעוצב עם לוגו אביר ספורט
- שליחת הצעת מחיר ב-WhatsApp
- מודלים תלת-ממדיים מפורטים (מדויקים לכל מוצר)
- מערכת ניהול (Admin Panel) לצוות אביר ספורט
- אנליטיקות - מכשירים פופולריים, עיצובים שנשמרו
- תבניות מוכנות (Templates) לחדרי כושר נפוצים
- מציאות מוגברת (AR) - הצגת מכשירים בחדר אמיתי דרך המצלמה

---

## 4. ארכיטקטורה טכנית (Technical Architecture)

### 4.1 Tech Stack

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  React 18 + TypeScript + Vite                   │
│  Three.js / React Three Fiber (3D Engine)       │
│  @react-three/drei (3D Helpers)                 │
│  Tailwind CSS (Styling)                         │
│  i18next (Internationalization HE/EN)           │
│  Zustand (State Management)                     │
└─────────────────┬───────────────────────────────┘
                  │ REST API / Realtime
┌─────────────────▼───────────────────────────────┐
│                   BACKEND                        │
│  Supabase (BaaS)                                │
│  ├── PostgreSQL Database                        │
│  ├── Edge Functions (Deno/TypeScript)           │
│  ├── Storage (3D Models, Images)                │
│  └── Realtime (Live Collaboration - Future)     │
└─────────────────────────────────────────────────┘
```

### 4.2 למה React + Three.js?
- **React Three Fiber** — ספריית React ל-Three.js, מאפשרת לכתוב סצנות 3D כ-React components
- **@react-three/drei** — אוסף helpers מוכנים (OrbitControls, Grid, Environment וכו')
- **ביצועים** — Three.js הוא ה-3D engine הפופולרי ביותר לוובאפים
- **קהילה גדולה** — הרבה דוגמאות, תיעוד ותמיכה

### 4.3 למה Supabase?
- כבר מחובר לפרויקט (יש לך חשבון Supabase)
- PostgreSQL מלא עם Row Level Security
- Storage מובנה לקבצי 3D ותמונות
- Edge Functions ל-Server-side logic
- חסכון בזמן פיתוח — אין צורך לבנות backend מאפס

---

## 5. מבנה מסד הנתונים (Database Schema)

```sql
-- קטגוריות מכשירים
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_he TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- מותגים
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- מכשירי כושר (קטלוג)
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_he TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_he TEXT,
  description_en TEXT,
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  sku TEXT UNIQUE,
  -- מידות פיזיות (בסנטימטרים)
  width_cm DECIMAL(6,1) NOT NULL,
  depth_cm DECIMAL(6,1) NOT NULL,
  height_cm DECIMAL(6,1) NOT NULL,
  -- מידות safe zone (מרחק מינימלי סביב המכשיר)
  safe_zone_width_cm DECIMAL(6,1) DEFAULT 50,
  safe_zone_depth_cm DECIMAL(6,1) DEFAULT 50,
  -- קבצים
  image_url TEXT NOT NULL,
  image_urls TEXT[], -- גלריית תמונות
  model_3d_url TEXT, -- קובץ GLB/GLTF
  model_3d_fallback TEXT, -- סוג מודל גנרי (treadmill, elliptical, etc.)
  -- מטא
  is_active BOOLEAN DEFAULT true,
  abirsport_url TEXT, -- קישור לעמוד המוצר באתר אביר ספורט
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- עיצובי חדרים שנשמרו
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code TEXT UNIQUE NOT NULL, -- קוד שיתוף קצר
  name TEXT NOT NULL DEFAULT 'עיצוב חדש',
  -- מידות החדר (במטרים)
  room_width DECIMAL(5,2) NOT NULL,
  room_depth DECIMAL(5,2) NOT NULL,
  room_height DECIMAL(5,2) DEFAULT 3.0,
  -- מטא
  creator_name TEXT,
  creator_email TEXT,
  creator_phone TEXT,
  total_price DECIMAL(12,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- מכשירים שמוקמו בתוך עיצוב
CREATE TABLE design_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id),
  -- מיקום בחדר (במטרים, מנקודת 0,0 של החדר)
  position_x DECIMAL(5,2) NOT NULL,
  position_y DECIMAL(5,2) DEFAULT 0, -- גובה מהרצפה
  position_z DECIMAL(5,2) NOT NULL,
  rotation_y DECIMAL(5,2) DEFAULT 0, -- סיבוב במעלות
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- אינדקסים
CREATE INDEX idx_equipment_category ON equipment(category_id);
CREATE INDEX idx_equipment_brand ON equipment(brand_id);
CREATE INDEX idx_equipment_active ON equipment(is_active) WHERE is_active = true;
CREATE INDEX idx_designs_share_code ON designs(share_code);
CREATE INDEX idx_design_items_design ON design_items(design_id);
```

---

## 6. קטגוריות מוצרים (מבוסס על האתר)

### קטגוריות ראשיות
| קטגוריה | תיאור | דוגמאות מוצרים |
|---------|--------|---------------|
| **כושר ביתי** | מכשירים לשימוש ביתי | הליכונים, אליפטיקלים, אופני כושר, ספות לחיצה |
| **כושר מקצועי** | מכשירים לחדרי כושר מסחריים | מכשירי כוח YORK, קרוס אובר, מולטי טריינר |
| **אימון פונקציונלי** | ציוד לקרוספיט ואימון פונקציונלי | מתקני קרוספיט, חבלים, כדורים |
| **יוגה ופילאטיס** | ציוד ייעודי | רפורמר, מזרנים, אביזרים |
| **אקססוריז** | אביזרי כושר קטנים | משקולות, גומיות, ידיות עבודה |

### מותגים עיקריים (שנמצאו באתר)
YORK, SPIRIT, VISION, CONCEPT 2, POWERTEC, BODY SOLID, BOWFLEX, FREEMOTION, SPORTART, STEELFLEX, REEBOK, REALLEADER, BOOTY BUILDER, TRX, SCHWINN, SOLE FITNESS, ELINA PILATES, INTENZA, MARBO SPORT, SPORTOP, TARGET, ASSAULT, UFC, LIFEGEAR, QUINCY, SCHIEK, EVER YOUNG, PRCTZ, GASP, BETTER BODIES, CARBON GRIP, TERRA CORE

---

## 7. גישת 3D - מודלים גנריים (MVP)

### אסטרטגיה
מכיוון שאין מודלים תלת-ממדיים מוכנים למכשירים, נשתמש בגישה של **מודלים גנריים לפי קטגוריה**:

```
מודלים גנריים שצריך ליצור:
├── treadmill.glb          — הליכון / מסלול ריצה
├── elliptical.glb         — אליפטיקל
├── exercise_bike.glb      — אופני כושר
├── spinning_bike.glb      — אופני ספינינג
├── rowing_machine.glb     — מכונת חתירה
├── cable_machine.glb      — קרוס אובר / כבל
├── multi_gym.glb          — מולטי טריינר
├── smith_machine.glb      — סמית' מכונה
├── bench_press.glb        — ספת לחיצה
├── power_rack.glb         — כלוב כוח / סקוואט רק
├── dumbbell_rack.glb      — מעמד משקולות
├── leg_press.glb          — מכבש רגליים
├── lat_pulldown.glb       — מכשיר מושכת עליון
├── chest_press.glb        — מכשיר לחיצת חזה
├── reformer.glb           — רפורמר פילאטיס
├── functional_trainer.glb — מתקן אימון פונקציונלי
├── booty_builder.glb      — Booty Builder machine
└── generic_machine.glb    — מכשיר כללי (fallback)
```

### מקורות למודלים
1. **Sketchfab** — מודלים חינמיים בפורמט GLB
2. **TurboSquid** — מודלים חינמיים/בתשלום
3. **Three.js procedural** — יצירת מודלים בסיסיים בקוד (קוביות + צילינדרים)
4. **AI 3D generation** — כלים כמו Meshy, Tripo3D ליצירת מודלים

### תהליך ב-MVP
1. כל מוצר מקושר ל-`model_3d_fallback` (סוג מכשיר)
2. המערכת טוענת את המודל הגנרי בהתאם
3. תמונת המוצר האמיתית מוצגת כ-Billboard/Label מעל המודל
4. בעתיד — אפשר להחליף למודלים מדויקים לכל מוצר

---

## 8. מיתוג ועיצוב (Branding & Design)

### צבעים (מבוסס על האתר)
```css
:root {
  /* Primary - Red (אדום אביר ספורט) */
  --color-primary: #E30613;
  --color-primary-dark: #C00510;
  --color-primary-light: #FF1A2A;

  /* Secondary - Dark (כהה לכותרות וניווט) */
  --color-dark: #1A1A1A;
  --color-dark-gray: #333333;

  /* Neutral */
  --color-white: #FFFFFF;
  --color-light-gray: #F5F5F5;
  --color-medium-gray: #E0E0E0;
  --color-text: #333333;
  --color-text-light: #666666;

  /* Accent */
  --color-success: #28A745;
  --color-warning: #FFC107;
  --color-info: #17A2B8;
}
```

### טיפוגרפיה
- **עברית**: פונט מערכת + Heebo (Google Fonts) או Assistant
- **אנגלית**: Roboto / Open Sans
- **כיוון**: RTL (ימין לשמאל) כברירת מחדל, עם תמיכה ב-LTR לאנגלית

### עקרונות עיצוב
- עיצוב נקי ומקצועי, בהתאם לאתר הקיים
- לוגו אביר ספורט בכותרת (header)
- ממשק חלוק ל-3 אזורים: קטלוג (צד ימין) | סצנת 3D (מרכז) | הצעת מחיר (צד שמאל/תחתון)
- רספונסיבי מההתחלה — במובייל הקטלוג והמחיר מופיעים כ-Bottom Sheet

---

## 9. מבנה הפרויקט (Project Structure)

```
abir-gym-simulator/
├── public/
│   ├── models/                  # קבצי 3D (GLB)
│   │   ├── treadmill.glb
│   │   ├── elliptical.glb
│   │   └── ...
│   ├── images/
│   │   ├── logo.svg
│   │   └── og-image.jpg
│   └── locales/
│       ├── he/translation.json
│       └── en/translation.json
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx       # קטלוג מכשירים
│   │   │   ├── PricePanel.tsx    # הצעת מחיר
│   │   │   └── MobileDrawer.tsx
│   │   ├── three/                # 3D Components
│   │   │   ├── Scene.tsx         # סצנה ראשית
│   │   │   ├── Room.tsx          # החדר (רצפה, קירות)
│   │   │   ├── EquipmentModel.tsx # מודל מכשיר בודד
│   │   │   ├── Grid.tsx          # רשת עזר
│   │   │   ├── Controls.tsx      # בקרות מצלמה
│   │   │   └── DragHandler.tsx   # גרירת מכשירים
│   │   ├── catalog/
│   │   │   ├── CatalogPanel.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── EquipmentCard.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── quote/
│   │   │   ├── QuoteTable.tsx
│   │   │   ├── QuoteRow.tsx
│   │   │   └── QuoteSummary.tsx
│   │   ├── room/
│   │   │   ├── RoomSetup.tsx     # הגדרת מידות
│   │   │   └── RoomControls.tsx
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── LanguageSwitcher.tsx
│   │       └── LoadingSpinner.tsx
│   ├── hooks/
│   │   ├── useEquipment.ts
│   │   ├── useDesign.ts
│   │   ├── useDragDrop.ts
│   │   └── useCollisionDetection.ts
│   ├── store/
│   │   ├── designStore.ts        # Zustand - מצב העיצוב
│   │   ├── catalogStore.ts       # Zustand - קטלוג
│   │   └── uiStore.ts            # Zustand - UI state
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── api.ts                # API helpers
│   │   └── utils.ts
│   ├── types/
│   │   ├── equipment.ts
│   │   ├── design.ts
│   │   └── room.ts
│   ├── i18n/
│   │   └── config.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── functions/
│   │   ├── scrape-catalog/       # סנכרון קטלוג מהאתר
│   │   └── generate-share-link/
│   └── seed.sql                  # נתוני פיתוח
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── .env.example
└── README.md
```

---

## 10. רספונסיביות (Responsive Design)

### Desktop (1024px+)
```
┌──────────────────────────────────────────────────┐
│  🔴 אביר ספורט    [HE|EN]   שמור   שתף         │
├─────────┬──────────────────────────┬─────────────┤
│ קטלוג   │                          │  הצעת מחיר  │
│ מכשירים │    סצנת 3D               │             │
│         │    (חדר כושר)            │  מוצר  מחיר │
│ 🔍חיפוש │                          │  ────  ──── │
│ [הליכון]│                          │  York  2489 │
│ [אליפ.] │                          │  YORK  1600 │
│ [אופני] │                          │             │
│ [מולטי] │     ┌────┐  ┌────┐      │  סה"כ: ₪XX  │
│         │     │🏃‍♂️  │  │🚴  │      │             │
│         │     └────┘  └────┘      │  [הזמן עכשיו]│
├─────────┴──────────────────────────┴─────────────┤
│  מידות חדר: 10m × 8m × 3m    [שנה מידות]        │
└──────────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────┐
│ 🔴 אביר ספורט [≡]   │
├──────────────────────┤
│                      │
│    סצנת 3D           │
│    (חדר כושר)        │
│                      │
│     ┌────┐  ┌────┐   │
│     │🏃‍♂️  │  │🚴  │   │
│     └────┘  └────┘   │
│                      │
├──────────────────────┤
│ [📋 קטלוג] [💰 מחיר] │ ← Tab bar
├──────────────────────┤
│ Bottom Sheet         │
│ (קטלוג / הצעת מחיר) │
└──────────────────────┘
```

---

## 11. תהליך עבודה (User Flow)

```
1. כניסה לוובאפ
   │
   ▼
2. הגדרת מידות חדר (או בחירת תבנית מוכנה)
   │  ← אורך × רוחב × גובה
   ▼
3. צפייה בחדר ריק ב-3D
   │
   ▼
4. גלילה בקטלוג מכשירים (צד ימין)
   │  ← חיפוש, סינון לפי קטגוריה/מותג
   ▼
5. גרירת מכשיר לתוך החדר (Drag & Drop)
   │  ← המכשיר מופיע בסצנת 3D
   ▼
6. מיקום וסיבוב המכשיר
   │  ← גרירה חופשית + Snap to Grid
   │  ← אזהרת התנגשות אם צריך
   ▼
7. חזרה על שלבים 4-6 עד שהחדר מושלם
   │
   ▼
8. צפייה בהצעת מחיר (טבלה על המסך)
   │  ← רשימת מכשירים + מחירים + סה"כ
   ▼
9. שמירה / שיתוף
   │  ← שמירה בענן → קבלת קישור שיתוף
   │  ← שליחה במייל (עתידי)
   ▼
10. לקוח מעוניין → פנייה לאביר ספורט
```

---

## 12. אינטגרציה עם אתר אביר ספורט (Data Sync)

### אסטרטגיית סנכרון קטלוג
מכיוון שלאביר ספורט יש אתר e-commerce קיים, צריך לסנכרן את הקטלוג:

**אופציה א' (מומלצת ל-MVP): הזנה ידנית**
- יצירת Admin Panel פשוט להוספת מכשירים
- צוות אביר ספורט מזין מכשירים ידנית עם מידות, מחירים ותמונות
- שליטה מלאה על איזה מוצרים מופיעים בסימולטור

**אופציה ב' (עתידי): Web Scraping**
- Edge Function שמסנכרן מוצרים מהאתר
- סנכרון אוטומטי של מחירים ותמונות
- דורש תחזוקה כשהאתר משתנה

**אופציה ג' (אידיאלי): API מהאתר**
- אם לאתר יש API (WooCommerce, Shopify וכו')
- סנכרון אוטומטי ואמין
- דורש שיתוף פעולה עם מפתחי האתר

### קישור לאתר
- כל מכשיר בסימולטור מקושר לעמוד המוצר באתר
- כפתור "צפה באתר" / "הזמן עכשיו" → מפנה לאתר אביר ספורט

---

## 13. תוכנית עבודה מפורטת (Development Roadmap)

### שבוע 1-2: תשתית
- [ ] הקמת פרויקט React + Vite + TypeScript
- [ ] הגדרת Tailwind CSS + RTL
- [ ] הגדרת i18next (עברית + אנגלית)
- [ ] הקמת Supabase — מסד נתונים + Storage
- [ ] יצירת סכמת Database (migrations)
- [ ] הזנת נתוני מוצרים ראשוניים (seed data)
- [ ] Layout ראשי: Header, Sidebar, Main area

### שבוע 3-4: מנוע 3D
- [ ] הקמת סצנת Three.js / React Three Fiber
- [ ] בניית Room component (רצפה + קירות)
- [ ] הגדרת מידות חדר דינמיות
- [ ] מודלים גנריים ראשונים (5-6 סוגי מכשירים)
- [ ] OrbitControls (סיבוב, זום)
- [ ] תאורה ואווירה בסיסית
- [ ] Grid helper על הרצפה

### שבוע 5-6: אינטראקציה
- [ ] Drag & Drop מהקטלוג לסצנה
- [ ] גרירת מכשירים בתוך החדר
- [ ] סיבוב מכשירים
- [ ] Collision detection בסיסי
- [ ] Snap to Grid
- [ ] הצגת תווית (Label) עם שם המוצר

### שבוע 7-8: פיצ'רים + ליטוש
- [ ] טבלת הצעת מחיר
- [ ] שמירה ב-Supabase
- [ ] שיתוף עיצוב (קישור ייחודי)
- [ ] רספונסיביות (מובייל)
- [ ] ליטוש UI/UX
- [ ] בדיקות ותיקוני באגים
- [ ] Deployment ל-Vercel/Netlify + Supabase

---

## 14. דרישות סביבה (Environment)

### משתני סביבה (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://gym.abirsport.co.il
VITE_DEFAULT_LANGUAGE=he
```

### תלויות עיקריות (package.json)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "@react-three/fiber": "^8.x",
    "@react-three/drei": "^9.x",
    "three": "^0.160.x",
    "@types/three": "^0.160.x",
    "@supabase/supabase-js": "^2.x",
    "zustand": "^4.x",
    "i18next": "^23.x",
    "react-i18next": "^14.x",
    "react-dnd": "^16.x",
    "react-dnd-html5-backend": "^16.x",
    "tailwindcss": "^3.x",
    "react-hot-toast": "^2.x",
    "uuid": "^9.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

---

## 15. Deployment

### Frontend
- **Vercel** (מומלץ) או **Netlify**
- Auto-deploy מ-GitHub
- Custom domain: `gym.abirsport.co.il` (נדרש הגדרת DNS)

### Backend
- **Supabase** (כבר קיים)
- Database + Storage + Edge Functions
- חינמי עד 500MB database + 1GB storage

---

## 16. סיכונים ופתרונות

| סיכון | סבירות | השפעה | פתרון |
|-------|--------|-------|-------|
| ביצועי 3D איטיים במובייל | בינונית | גבוהה | LOD (Level of Detail), אופטימיזציה של מודלים, fallback ל-2D |
| חוסר מודלים 3D איכותיים | גבוהה | בינונית | מודלים גנריים + תמונות billboard כפתרון ביניים |
| סנכרון קטלוג עם האתר | בינונית | בינונית | התחלה עם הזנה ידנית, מעבר לאוטומטי בהמשך |
| מידות מכשירים לא מדויקות | בינונית | בינונית | מדידות ראשוניות + אפשרות לעדכון |
| חווית Drag & Drop במובייל | בינונית | בינונית | Touch events, שימוש בכפתורי "הוסף" במקום גרירה |

---

## 17. מדדי הצלחה (KPIs)

- **זמן טעינה**: מתחת ל-3 שניות
- **FPS בסצנת 3D**: מעל 30fps בדסקטופ, מעל 20fps במובייל
- **עיצובים שנשמרו**: X עיצובים בחודש
- **הצעות מחיר שנוצרו**: X הצעות בחודש
- **המרה**: % מהמשתמשים שלחצו "צור קשר" / "הזמן עכשיו"

---

## 18. הערות נוספות

1. **הנחיה לקלוד קוד**: מסמך זה מיועד לשמש כהנחיה ראשית. יש להתחיל מבניית ה-scaffold (תשתית), אח"כ הסצנה ה-3D, ואז הפיצ'רים
2. **RTL**: שים לב ש-Tailwind CSS דורש הגדרות RTL (dir="rtl" + plugin)
3. **נגישות**: האתר של אביר ספורט כבר תומך בנגישות — נדרש להמשיך את הקו הזה
4. **SEO**: פחות רלוונטי לאפליקציית 3D, אבל דף נחיתה עם מטא טגים חשוב
5. **Analytics**: להוסיף Google Analytics / Mixpanel למעקב אחרי שימוש

---

---

## 19. מה כבר מוכן (נעשה בשלב התכנון)

### Supabase Project
- **פרויקט נוצר**: `abir-gym-simulator`
- **Project ID**: `jeooncloibvhempcldzt`
- **Region**: eu-west-1 (אירופה)
- **URL**: `https://jeooncloibvhempcldzt.supabase.co`
- **עלות**: $0/חודש (Free Tier)

### מסד נתונים מוכן
מסד הנתונים כבר הוקם עם הטבלאות הבאות:
- **categories** — 20 רשומות (5 ראשיות + 15 תת-קטגוריות)
- **brands** — 20 מותגים (YORK, SPIRIT, CONCEPT 2, POWERTEC, BODY SOLID ועוד)
- **model_types** — 18 סוגי מודלים 3D גנריים
- **equipment** — 15 מוצרים לדוגמה (מבוססים על מוצרים אמיתיים מהאתר)
- **designs** — טבלת עיצובים שנשמרו
- **design_items** — מכשירים ממוקמים בעיצובים
- **analytics_events** — מעקב אחר שימוש
- **RLS** מופעל על כל הטבלאות עם policies לגישה חופשית לקריאה

### כלי AI ליצירת מודלים 3D (נמצאו ב-HuggingFace)
כלים מומלצים ליצירת המודלים הגנריים למכשירי הכושר:

| כלי | תיאור | שימוש |
|------|--------|-------|
| **TRELLIS.2** (Microsoft) | Image-to-3D ברזולוציה גבוהה | המרת תמונות מכשירים למודלים 3D |
| **Hunyuan3D-2.1** (Tencent) | Text/Image to 3D | יצירת מודלים מטקסט או תמונה |
| **TripoSG** (VAST-AI) | Image-to-3D מהיר | יצירת מודלים מהירים מתמונה בודדת |
| **CraftsMan3D** | High-fidelity mesh | מודלים באיכות גבוהה |

**תהליך מומלץ**: לקחת תמונות מכשירים מהאתר → להעלות ל-TRELLIS.2 → לקבל קובץ GLB → להעלות ל-Supabase Storage

### דיאגרמת ארכיטקטורה ב-Figma
נוצרה דיאגרמת ארכיטקטורת המערכת ב-FigJam — כולל Frontend, 3D Scene, Supabase Backend ו-Data Flow.

---

## 20. הנחיות לפיתוח ב-Claude Code

כשמתחילים לפתח, יש להתחיל בסדר הבא:

### שלב 1: Scaffold
```bash
npm create vite@latest abir-gym-simulator -- --template react-ts
cd abir-gym-simulator
npm install @react-three/fiber @react-three/drei three @supabase/supabase-js zustand i18next react-i18next tailwindcss
```

### שלב 2: חיבור Supabase
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://jeooncloibvhempcldzt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)
```

### שלב 3: סצנת 3D בסיסית
- Room.tsx → רצפה + קירות לפי מידות
- EquipmentModel.tsx → מודל גנרי לפי model_type
- Scene.tsx → סצנה ראשית עם OrbitControls

### שלב 4: UI
- Sidebar עם קטלוג מכשירים (fetch מ-Supabase)
- Drag & Drop לתוך הסצנה
- טבלת הצעת מחיר

### שלב 5: שמירה ושיתוף
- שמירת עיצוב ב-Supabase
- יצירת share_code ייחודי
- טעינת עיצוב לפי קישור

---

*מסמך זה נוצר ב-24 במרץ 2026 | גרסה 2.0*
*Supabase מוכן | Database מוכן | מוכן לפיתוח ב-Claude Code*
