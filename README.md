# PassportX — Frontend

Next.js 15 + TypeScript ile yazılmış Tekstil Dijital Ürün Pasaportu yönetim arayüzü.

---

## Teknoloji Seçimleri ve Gerekçeleri

**Framework - Next.js 15**

React tabanlı, App Router ile güçlü dosya sistemi yönlendirme sağlar ve TypeScript desteği içerir. React-app'e kıyasla production-ready özelliğe sahiptir.

**Dil - TypeScript**

JS'e kıyasla tip güvenliği sağlar , hataları derleme zamanında yakalar.

**Stil - Tailwind CSS**

Utility-first, tutarlı spacing/color sistemi, dark mode desteği

**State - Zustand**

Minimal boilerplate içerir - store tek fonksiyonla tanımlanır. Context API'ye kıyasla gereksiz re-render gerçekleşmez. persist middleware ile localStorage entegrasyonu içerir.

**HTTP - Axios**

Fetch API'ye kıyasla interceptor desteği ile JWT token'ı her isteğe otomatik eklenir, 401 geldiğinde merkezi logout yapılır. tek bir bölgede hata yönetimi sağlar.

**Grafikler - Recharts**

React bileşeni olarak yazılmıştır, JSX içinde doğrudan kullanılabildiğinden ayrı canvas yönetimi gerektirmez. responsive container içerir, mobil uyumlu çalışabilir

**Bildirimler - react-hot-toast**

Erişilebilir, özelleştirilebilir toast bildirimleri

**Çok dil - i18next + react-i18next**

Türkçe/İngilizce dil desteği, sidebar'dan değiştirilebilir

---

## Kurulum

### Gereksinimler

- Node.js 20+
- Backend **http://localhost:8000** adresinde çalışıcak

### Adımlar

```bash
# 1.Klasöre geçiş
cd TunahanYilmaz-case-frontend

# 2. Bağımlılıkları yükle
npm install

# 3. Uygulamayı çalıştır
npm run dev
```

Uygulama **http://localhost:3000** adresinde çalışacaktır.

API istekleri lib/api.ts üzerinden doğrudan http://localhost:8000 adresine gönderilir. Backend'de CORS açık bırakılmıştır.

---

## Tasarım Kararları

### Estetik Yaklaşım

Arayüz **"endüstriyel-minimal"** bir yönde tasarlandı — temiz, veri odaklı, sürdürülebilirlik bağlamını yansıtan yeşil marka rengi. Aşırı görsel içeriklerden kaçınıldı , dashboard aracı ön planda tutuldu.

**Tipografi:**

- `Syne` (başlıklar) — geometrik, modern, editoryal his
- `DM Sans` (gövde) — yüksek okunabilirlik, optik boyut optimize
- `JetBrains Mono` (ID'ler, roller, kod) — veri bağlamları için monospace

**Renk Paleti:**

- Marka: `#16a34a` (green-600) — sürdürülebilirlik çağrışımı kasıtlı
- Arka plan: `#f8fafc` açık / `#0f1117` koyu — düşük chroma, göz dostu
- Tüm renkler CSS custom properties üzerinden tanımlanır, dark mode sorunsuz çalışır

**Komponent Kararları:**

- Liste görünümleri için tablo (veri yoğunluğu)
- dashboard istatistikleri için kart bileşenleri
- Materyal kompozisyonu mini progress bar ile görselleştirildi
- Sidebar navigasyon, aktif sayfa vurgulamalı

### Dil Desteği

i18next ile Türkçe/İngilizce desteği. Varsayılan dil Türkçe. Sidebar ve giriş/kayıt sayfalarından değiştirilebilir.

### Form Validasyonu

Client-side validasyon API isteğinden önce çalışır, alan bazlı hata mesajları gösterilir. Backend hataları (örn. e-posta çakışması) toast bildirimi olarak iletilir. Materyal yüzdesi toplamı gerçek zamanlı sayaçla gösterilir.

---

## Proje Yapısı

```
frontend/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Kök layout, font yükleme
│   ├── page.tsx                # Kök sayfa, dashboard'a yönlendirir
│   ├── auth/
│   │   ├── login/page.tsx      # Giriş sayfası
│   │   └── register/page.tsx   # Kayıt sayfası
│   ├── dashboard/
│   │   └── page.tsx            # İstatistik kartları + grafikler
│   ├── products/
│   │   ├── page.tsx            # Ürün listesi, arama/filtreleme
│   │   └── [id]/page.tsx       # Ürün detayı / pasaport görüntüleyici
│   ├── users/
│   │   └── page.tsx            # Kullanıcı yönetimi (sadece admin)
│   └── profile/
│       └── page.tsx            # Profil bilgisi + şifre değiştirme
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx         # Sidebar navigasyon, tema ve dil toggle
│   └── ProductFormModal.tsx    # Ürün oluşturma/düzenleme modal
├── lib/
│   ├── api.ts                  # Axios instance, JWT interceptor
│   └── i18n.ts                 # i18next yapılandırması, TR/EN çeviriler
├── store/
│   └── index.ts                # Zustand store'ları: auth, tema, dil
└── next.config.js              # API yapılandırması
```

---

## Sayfalar

| Rota             | Yetki          | Açıklama                                 |
| ---------------- | -------------- | ---------------------------------------- |
| `/auth/login`    | Herkese açık   | JWT giriş formu                          |
| `/auth/register` | Herkese açık   | Kayıt (auditor rolü)                     |
| `/dashboard`     | Giriş yapılmış | İstatistik kartları + bar/donut grafik   |
| `/products`      | Giriş yapılmış | Filtrelenebilir ürün tablosu, admin CRUD |
| `/products/:id`  | Giriş yapılmış | Pasaport detayı, materyal tablosu        |
| `/users`         | Admin          | Kullanıcı listesi, rol değiştirme, silme |
| `/profile`       | Giriş yapılmış | Profil bilgisi + şifre değiştirme        |

---

## Varsayımlar

- Next.js App Router tercih edildi — daha modern ve esnek
- TypeScript zorunlu tutuldu, tip güvenliği önceliklendirildi
- Zustand persist ile kimlik doğrulama ve tema tercihleri localStorage'a kaydedilir
- Uygulama varsayılan olarak Türkçe açılır
