# Demo Step-by-Step - Simple Library REST API

## 1. Mục tiêu buổi demo
Trong 5-10 phút, bạn cần chứng minh:
1. Bạn tự build được REST API.
2. API có auth + phân quyền.
3. API có nghiệp vụ mượn/trả sách.
4. API có tích hợp external API.

## 2. Chuẩn bị trước khi demo

### 2.1 Chạy project
Mở terminal ở thư mục project và chạy:

```bash
npm install
npm run reset-db
npm start
```

Server chạy tại:
`http://localhost:3000`

### 2.2 Import Postman collection
Import file:
`docs/postman/Simple-Library-REST-API.postman_collection.json`

Đặt biến:
- `baseUrl = http://localhost:3000/api/v1`

## 3. Script demo từng bước

### Bước 1: Health check (30 giây)
Request:
`GET {{baseUrl}}/health`

Bạn nói:
"Đây là endpoint kiểm tra server và database đang hoạt động."

Kỳ vọng:
- Status `200`
- `data.app = ok`, `data.db = ok`

### Bước 2: Login admin (45 giây)
Request:
`POST {{baseUrl}}/auth/login`

Body:
```json
{
  "email": "admin@library.local",
  "password": "admin123"
}
```

Bạn nói:
"Admin login để lấy token và thực hiện các API quản trị."

Kỳ vọng:
- Status `200`
- Có `access_token`
- Collection tự lưu `adminToken`

### Bước 3: Login user (45 giây)
Request:
`POST {{baseUrl}}/auth/login`

Body:
```json
{
  "email": "user1@example.com",
  "password": "123456"
}
```

Bạn nói:
"User thường login để dùng API mượn/trả sách."

Kỳ vọng:
- Status `200`
- Có `access_token`
- Collection tự lưu `userToken`

### Bước 4: Admin tạo sách mới (1 phút)
Request:
`POST {{baseUrl}}/books`
Header:
- `Authorization: Bearer {{adminToken}}`

Body:
```json
{
  "title": "Node API for Newbie",
  "author": "Teacher Demo",
  "isbn": "9780000000001",
  "published_year": 2026,
  "total_copies": 4
}
```

Bạn nói:
"Endpoint này chỉ admin mới gọi được, thể hiện phân quyền role."

Kỳ vọng:
- Status `201`
- Có `id` sách mới (collection tự lưu `bookId`)

### Bước 5: User mượn sách (1 phút)
Request:
`POST {{baseUrl}}/borrows`
Header:
- `Authorization: Bearer {{userToken}}`

Body:
```json
{
  "book_id": 1,
  "due_date": "2026-03-20"
}
```

Bạn nói:
"Khi user mượn sách, hệ thống tạo borrow record và giảm available_copies."

Kỳ vọng:
- Status `201`
- Có `borrow id` (collection tự lưu `borrowId`)
- `status = borrowing`

### Bước 6: User trả sách (1 phút)
Request:
`PATCH {{baseUrl}}/borrows/{{borrowId}}/return`
Header:
- `Authorization: Bearer {{userToken}}`

Bạn nói:
"Khi trả sách, hệ thống set returned_at và tăng available_copies lại."

Kỳ vọng:
- Status `200`
- `status = returned`

### Bước 7: Demo phân quyền/lỗi auth (45 giây)
Request:
`POST {{baseUrl}}/books`
Không gửi token.

Bạn nói:
"Nếu thiếu token, hệ thống trả lỗi 401."

Kỳ vọng:
- Status `401`

### Bước 8: Demo external API (1 phút)
Request:
`GET {{baseUrl}}/external/books/search?title=harry+potter&limit=5`

Bạn nói:
"Đây là endpoint nội bộ của mình gọi Open Library API và map dữ liệu về format thống nhất."

Kỳ vọng:
- Có mạng: Status `200`, trả danh sách sách.
- Không có mạng: Status `502`, đây là fallback đã xử lý.

## 4. Luồng nói khi demo (gợi ý ngắn)
1. "Đầu tiên em kiểm tra health endpoint."
2. "Em login admin và user để lấy 2 token đại diện 2 role."
3. "Admin tạo sách mới để chứng minh quyền quản trị."
4. "User mượn và trả sách để chứng minh nghiệp vụ chính."
5. "Em thử request không token để chứng minh auth."
6. "Cuối cùng em demo tích hợp external API."

## 5. Nếu giảng viên hỏi "REST ở đâu?"
Bạn trả lời ngắn:
1. URL theo resource: `/books`, `/borrows`.
2. Dùng method đúng: `GET/POST/PATCH/DELETE`.
3. Trả JSON + status code chuẩn.
4. Stateless auth qua Bearer token.

## 6. Nếu giảng viên hỏi "Free/Paid API?"
Bạn trả lời ngắn:
1. Demo dùng Open Library (free).
2. Paid API thường có SLA, quota cao, support tốt hơn.
3. Bản học tập chỉ cần free để chứng minh cách tích hợp.

## 7. Tài liệu liên quan để mở khi demo
1. `README.md`
2. `docs/final-implementation-report.md`
3. `docs/module-2-auth.md`
4. `docs/module-4-borrow-return.md`
5. `docs/module-5-external-api.md`
