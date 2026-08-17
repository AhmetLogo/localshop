# LocalShop

LocalShop, yerel üreticilerin ürünlerini doğrudan müşterilere satabildiği bir marketplace MVP uygulamasıdır. Seller'lar ürün ekler/yönetir, customer'lar ürünleri keşfedip sepete ekler, siparişe dönüştürür ve FakePay simülasyonuyla öder.

## Project Description

Temel akışlar:

1. Seller kayıt olur, giriş yapar, ürün ekler/düzenler/siler.
2. Customer ürünleri listeler, arar, filtreler, sepete ekler.
3. Customer sepetini siparişe dönüştürür ve FakePay ile öder.
4. Seller kendisine gelen siparişleri görüntüler, SHIPPED/DELIVERED olarak günceller.

## Architecture

```text
┌───────────────────────────────┐
│          React SPA            │
│ Pages / Components            │
│ API Service Layer             │
│ Context (Auth, Cart) + Hooks  │
└──────────────┬────────────────┘
               │ HTTP / JSON
               ▼
┌───────────────────────────────┐
│      Node.js + Express        │
│ Routes → Middleware            │
│      → Controllers             │
│      → Services (business)     │
│      → Mongoose Models         │
└──────────────┬────────────────┘
               │ Mongoose
               ▼
┌───────────────────────────────┐
│           MongoDB             │
└───────────────────────────────┘
```

Modüler monolith + REST API + React SPA. Her katman tek bir sorumluluğa sahiptir (SOLID / Single Responsibility):

- **Routes**: yalnızca URL → middleware → controller eşlemesi.
- **Middleware**: authentication, authorization, validation, rate limiting.
- **Controllers**: HTTP request/response çevirisi, business logic içermez.
- **Services**: tüm business logic (stok kontrolü, sahiplik kontrolü, sipariş gruplama, ödeme simülasyonu) burada yaşar — controller'lar service'lere bağımlıdır, tersi değil (Dependency Inversion ruhu).
- **Models**: Mongoose şemaları, veri kuralları (min/required/enum).

Frontend'de component'ler doğrudan `fetch` çağırmaz; `services/*Api.js` katmanı üzerinden REST API'ye erişir (`productApi.getProducts()` gibi). Auth ve Cart durumu `Context API` ile global tutulur; form/loading/error/search gibi durumlar sayfa-lokal `useState` ile yönetilir.

## Technologies

**Frontend:** React, Vite, React Router, Fetch API, Context API, CSS
**Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, helmet, express-rate-limit, cors
**Database:** MongoDB
**Dev/Test:** Nodemon, Postman

## Project Structure

```text
localshop/
├── frontend/            # React SPA (Vite)
│   └── src/
│       ├── components/  # common, product, cart, order
│       ├── pages/
│       ├── services/    # API service layer
│       ├── context/      # AuthContext, CartContext
│       ├── hooks/
│       └── styles/
├── backend/              # Express REST API
│   └── src/
│       ├── config/        # database.js
│       ├── models/        # User, Product, Cart, Order
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── middleware/    # auth, role, validation, rate limit, error
│       ├── validators/
│       ├── utils/
│       ├── app.js
│       └── server.js
└── docs/
    └── postman/          # LocalShop.postman_collection.json
```

## Requirements

- Node.js 18+
- MongoDB 6+ (yerelde `mongod` çalışıyor olmalı)

## Installation

```bash
# Backend
cd localshop/backend
npm install
cp .env.example .env   # gerekirse değerleri düzenleyin

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

## Environment Variables

**backend/.env**

| Değişken | Açıklama |
|---|---|
| `PORT` | API'nin çalışacağı port (varsayılan `5050` — macOS'ta 5000 AirPlay Receiver ile çakışabildiği için 5050 kullanılır) |
| `MONGO_URI` | MongoDB bağlantı adresi |
| `JWT_SECRET` | JWT imzalama anahtarı (production'da uzun/rastgele olmalı) |
| `JWT_EXPIRES_IN` | Token geçerlilik süresi (ör. `7d`) |
| `CLIENT_ORIGIN` | CORS için izin verilen frontend origin'i |

**frontend/.env**

| Değişken | Açıklama |
|---|---|
| `VITE_API_BASE_URL` | Backend API kök adresi (ör. `http://localhost:5050/api`) |

## Running Backend

```bash
cd localshop/backend
npm run dev     # nodemon ile
# veya
npm start
```

Sağlık kontrolü: `GET http://localhost:5050/api/health` → `{"status":"ok"}`

## Running Frontend

```bash
cd localshop/frontend
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

## API Documentation

Postman collection: [`docs/postman/LocalShop.postman_collection.json`](docs/postman/LocalShop.postman_collection.json) — Auth, Products, Seller Products, Cart, Orders, Payments klasörleri ve her protected endpoint için No Token / Invalid Token / Wrong Role / Wrong Owner senaryolarını içerir.

### Uç noktalar (özet)

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/products
GET    /api/products/:id
POST   /api/products              (SELLER)
PATCH  /api/products/:id          (SELLER, owner)
DELETE /api/products/:id          (SELLER, owner)
GET    /api/seller/products       (SELLER)

GET    /api/cart                  (CUSTOMER)
POST   /api/cart/items            (CUSTOMER)
PATCH  /api/cart/items/:productId (CUSTOMER)
DELETE /api/cart/items/:productId (CUSTOMER)

POST   /api/orders                (CUSTOMER)
GET    /api/orders                (CUSTOMER)
GET    /api/orders/:id            (CUSTOMER, owner)
GET    /api/seller/orders         (SELLER)
PATCH  /api/seller/orders/:id/status (SELLER, owner)

POST   /api/payments/pay          (CUSTOMER)
```

Standart response formatı:

```json
{ "success": true, "data": {} }
{ "success": false, "message": "..." }
```

## User Roles

| Rol | Yetkiler |
|---|---|
| `CUSTOMER` | ürünleri görüntüler/arar, sepet yönetir, sipariş oluşturur/görüntüler, ödeme yapar |
| `SELLER` | kendi ürünlerini ekler/düzenler/siler, kendisine gelen siparişleri görüntüler ve SHIPPED/DELIVERED olarak günceller |

## Fake Payment Cards

| Kart Numarası | Sonuç |
|---|---|
| `4242424242424242` | Başarılı ödeme → sipariş `PAID` |
| `4000000000000002` | Başarısız ödeme → sipariş `PAYMENT_FAILED` |

## Security Decisions

- Şifreler `bcryptjs` ile hash'lenir, hiçbir zaman düz metin saklanmaz veya response'da dönmez (`User.password` alanı `select: false`).
- Kimlik doğrulama `JWT` ile yapılır (`Authorization: Bearer <token>`); `authMiddleware` her protected route'ta token'ı doğrular ve `req.user`'ı doldurur.
- Rol bazlı yetkilendirme `roleMiddleware` (`authorize("SELLER")` / `authorize("CUSTOMER")`) ile uygulanır.
- Resource ownership her zaman rol kontrolünün üzerine eklenir: seller yalnızca `product.sellerId === req.user.id` olan ürünleri, `order.sellerId === req.user.id` olan siparişleri değiştirebilir; customer yalnızca `order.customerId === req.user.id` olan siparişleri görebilir.
- **Fiyat asla client'tan güvenilmez**: sepete ekleme ve sipariş oluşturma sırasında fiyat her zaman `Product` koleksiyonundan okunur; client'ın gönderdiği `price`/`totalPrice` alanları yok sayılır.
- **Kart bilgileri** (`cardNumber`, `cardHolder`, `expiry`, `cvv`) hiçbir yerde saklanmaz, loglanmaz, response'da geri dönülmez ve `Order` modeline eklenmez — `paymentService` yalnızca bellek içinde son kart hanesini simülasyon için kontrol eder.
- `JWT_SECRET` ve `MONGO_URI` yalnızca `.env` içinde tutulur, repoya commit edilmez (`.gitignore`).
- `express-rate-limit` ile genel, auth ve payment endpoint'lerine ayrı limitler uygulanır.
- `cors` yalnızca `CLIENT_ORIGIN` origin'ine izin verir; `helmet` ile güvenlik header'ları eklenir.
- Merkezi validation middleware (`validationMiddleware.js` + `validators/*.js`) her request'i controller'a ulaşmadan doğrular.
- Global error middleware, production ortamında beklenmeyen hatalarda stack trace/iç detay göndermez.

## Architectural Decisions

- **Modüler monolith** tercih edildi; MVP kapsamında microservice/GraphQL gibi ek karmaşıklık gerekmiyor.
- Backend katmanları tek yönlü bağımlılık zinciri izler: `Route → Middleware → Controller → Service → Model`. Controller'lar ince tutulur, tüm iş kuralları `services/` içinde yaşar (test edilebilirlik ve SRP için).
- **Order snapshot**: `Order.items` içindeki `productName` ve `unitPrice` sipariş anında kopyalanır; ürün sonradan değişse/silinse bile geçmiş siparişler etkilenmez.
- **Multi-seller checkout**: sepet seller'a göre gruplanır ve her seller için ayrı `Order` dokümanı oluşturulur — böylece her seller yalnızca kendi siparişini yönetir.
- Sipariş oluşturma standalone MongoDB üzerinde (replica set gerektiren) multi-document transaction kullanmaz; bunun yerine stok, sipariş oluşturmadan hemen önce taze veriden tekrar doğrulanır. Production'da replica set + transaction önerilir.
- Frontend'de component'ler API detaylarından izole edilmiştir (`services/*Api.js`); ek state management kütüphanesi kullanılmadan `useState`/`useEffect`/`Context API` ile MVP ihtiyacı karşılanmıştır.
- Frontend route koruması (`ProtectedRoute`) yalnızca UX amaçlıdır; gerçek yetkilendirme her zaman backend'de zorunlu kılınır.

## MVP Limitations

- Ödeme tamamen simüledir (FakePay); gerçek bir ödeme sağlayıcısı entegre edilmemiştir.
- Ürün görselleri desteklenmemektedir.
- E-posta doğrulama / şifre sıfırlama akışları yoktur.
- Sipariş oluşturma standalone MongoDB'de tam ACID garantisi vermez (yukarıda açıklandığı gibi).
- Otomatik test suite'i opsiyonel bırakılmıştır; doğrulama Postman collection'ı ve manuel/tarayıcı testleriyle yapılmıştır.
- Sayfalama (`page`/`limit`) mevcuttur ancak frontend'de sonsuz kaydırma/manuel sayfa geçişi UI'ı eklenmemiştir.
