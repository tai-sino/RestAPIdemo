# Module Plan and Flow (Newbie Guide) - Simple Library REST API

## 1. Bạn đang làm gì trong project này?
Bạn sẽ làm một backend REST API cho thư viện sách, đủ để demo:
1. Đăng ký, đăng nhập.
2. Quản lý sách.
3. Mượn và trả sách.
4. Gọi API sách bên ngoài (Open Library).

Mục tiêu chính là học tư duy API, không phải làm hệ thống lớn.

## 2. Giải thích nhanh các khái niệm cơ bản

### 2.1 API là gì?
API là "cửa giao tiếp" để ứng dụng khác gọi vào hệ thống của bạn.

Ví dụ:
1. Client gửi `GET /api/v1/books`.
2. Server trả danh sách sách dạng JSON.

### 2.2 REST API là gì?
REST là cách thiết kế API theo tài nguyên (resource):
1. `/books` là tài nguyên sách.
2. `/borrows` là tài nguyên mượn sách.

Dùng method HTTP chuẩn:
1. `GET`: lấy dữ liệu.
2. `POST`: tạo mới.
3. `PATCH`: cập nhật một phần.
4. `DELETE`: xóa.

### 2.3 Request và Response
Request là dữ liệu client gửi lên server.
Response là dữ liệu server trả về cho client.

Ví dụ request:
```http
POST /api/v1/auth/login
Content-Type: application/json
```

Ví dụ body:
```json
{
  "email": "user1@example.com",
  "password": "123456"
}
```

Ví dụ response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "..."
  }
}
```

### 2.4 Status code quan trọng
1. `200`: thành công.
2. `201`: tạo mới thành công.
3. `401`: chưa đăng nhập hoặc token sai.
4. `403`: có đăng nhập nhưng không đủ quyền.
5. `404`: không tìm thấy dữ liệu.
6. `422`: dữ liệu đầu vào không hợp lệ.
7. `500`: lỗi server.

### 2.5 Token là gì?
Sau khi login, server trả token.  
Client gửi token trong header:
```http
Authorization: Bearer <token>
```
Server dùng token để biết bạn là ai.

### 2.6 Role user/admin
1. `user`: chỉ xem sách, mượn/trả sách của mình.
2. `admin`: thêm/sửa/xóa sách, xem toàn bộ lượt mượn.

## 3. Kiến trúc đơn giản của project

Luồng khi gọi API:
1. Client gọi endpoint.
2. Router nhận URL và chuyển vào Controller.
3. Controller validate dữ liệu.
4. Middleware kiểm tra token/role (nếu cần).
5. Service xử lý nghiệp vụ.
6. Model truy vấn MySQL.
7. Trả JSON cho client.

Bạn có thể hình dung:
`Client -> Route -> Controller -> Service -> Model -> MySQL -> JSON Response`

## 4. Thiết kế dữ liệu và luật nghiệp vụ

### 4.1 Bảng users
Lưu tài khoản và quyền.

Trường chính:
1. `id`
2. `name`
3. `email` (duy nhất)
4. `password_hash`
5. `role` (`user` hoặc `admin`)

### 4.2 Bảng books
Lưu thông tin sách và số lượng.

Trường chính:
1. `title`
2. `author`
3. `isbn`
4. `total_copies`
5. `available_copies`

### 4.3 Bảng borrows
Lưu lịch sử mượn/trả.

Trường chính:
1. `user_id`
2. `book_id`
3. `borrowed_at`
4. `due_date`
5. `returned_at`
6. `status`

### 4.4 Luật nghiệp vụ quan trọng
1. Chỉ mượn khi `available_copies > 0`.
2. Mượn thành công thì giảm `available_copies` đi 1.
3. Trả thành công thì tăng `available_copies` lên 1.
4. User chỉ được trả bản ghi mượn của chính họ.

## 5. Lộ trình module (làm đúng thứ tự)
1. Module 0: Setup.
2. Module 1: Database.
3. Module 2: Auth API.
4. Module 3: Book API.
5. Module 4: Borrow/Return API.
6. Module 5: External API.
7. Module 6: Test + tài liệu + demo.

---

## 6. Module 0 - Setup nền tảng

### 6.1 Mục tiêu
Chạy được server và kết nối DB.

### 6.2 Bạn cần làm
1. Tạo project backend.
2. Cấu hình `.env` kết nối MySQL.
3. Tạo endpoint test `GET /api/v1/health`.
4. Chuẩn hóa 1 format JSON response.

### 6.3 Flow hoạt động
1. Client gọi `/api/v1/health`.
2. Server trả `200 OK`.
3. Nếu DB kết nối ok, trả thêm trạng thái DB.

### 6.4 Kiểm tra bằng Postman
1. Tạo request `GET /api/v1/health`.
2. Bấm Send.
3. Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Service healthy",
  "data": {
    "app": "ok",
    "db": "ok"
  }
}
```

### 6.5 Lỗi hay gặp
1. Sai `DB_HOST/DB_PORT/DB_PASSWORD`.
2. Chưa tạo database trong MySQL.
3. Server chạy sai port.

### 6.6 Checklist hoàn thành
1. Server chạy local ổn.
2. Endpoint health hoạt động.
3. DB kết nối thành công.

---

## 7. Module 1 - Database schema

### 7.1 Mục tiêu
Tạo đủ bảng để code nghiệp vụ.

### 7.2 Bạn cần làm
1. Migration cho `users`, `books`, `borrows`.
2. Tạo khóa ngoại:
   `borrows.user_id -> users.id`
   `borrows.book_id -> books.id`
3. Tạo index cơ bản:
   `users.email` unique.
   `books.title` index.
4. Tạo dữ liệu mẫu:
   1 admin, 1 user, 5-10 sách.

### 7.3 Flow hoạt động
1. Chạy migrate.
2. DB sinh bảng.
3. Chạy seed.
4. Có dữ liệu để test API ngay.

### 7.4 Kiểm tra
1. Query `SELECT * FROM users;`
2. Query `SELECT * FROM books;`
3. Query `SELECT * FROM borrows;`

### 7.5 Lỗi hay gặp
1. Quên `unique(email)` gây trùng email.
2. Quên default `available_copies`.
3. Sai kiểu dữ liệu `returned_at` không nullable.

### 7.6 Checklist hoàn thành
1. Có đủ 3 bảng.
2. Chạy seed không lỗi.
3. Có tài khoản admin/user để test.

---

## 8. Module 2 - Auth API

### 8.1 Mục tiêu
Đăng ký, đăng nhập và xác thực token.

### 8.2 Endpoint
1. `POST /api/v1/auth/register`
2. `POST /api/v1/auth/login`
3. `GET /api/v1/auth/me`

### 8.3 Dữ liệu vào/ra cơ bản

Register request:
```json
{
  "name": "User One",
  "email": "user1@example.com",
  "password": "123456"
}
```

Login response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "token_here",
    "token_type": "Bearer"
  }
}
```

### 8.4 Flow đăng nhập
1. Client gửi email/password.
2. Server tìm user theo email.
3. So khớp password hash.
4. Tạo token.
5. Trả token về client.

### 8.5 Flow `/auth/me`
1. Client gửi token trong header.
2. Middleware đọc token.
3. Nếu token hợp lệ, trả thông tin user.

### 8.6 Lỗi hay gặp
1. Trả luôn password hash trong response.
2. Quên middleware cho `/auth/me`.
3. Token hết hạn nhưng không xử lý đúng 401.

### 8.7 Checklist hoàn thành
1. Register được user mới.
2. Login nhận token.
3. `/auth/me` trả đúng user theo token.

---

## 9. Module 3 - Book API

### 9.1 Mục tiêu
Làm CRUD sách và tách quyền đọc/ghi rõ ràng.

### 9.2 Endpoint
1. `GET /api/v1/books`
2. `GET /api/v1/books/{id}`
3. `POST /api/v1/books` (admin)
4. `PATCH /api/v1/books/{id}` (admin)
5. `DELETE /api/v1/books/{id}` (admin)

### 9.3 Validation gợi ý
1. `title`: bắt buộc, tối đa 255 ký tự.
2. `author`: bắt buộc.
3. `total_copies`: số nguyên >= 0.
4. `available_copies`: số nguyên >= 0 và không lớn hơn `total_copies`.

### 9.4 Flow thêm sách (admin)
1. Admin gửi request + token.
2. Middleware kiểm tra token hợp lệ.
3. Middleware kiểm tra role admin.
4. Validate input.
5. Lưu vào DB.
6. Trả `201`.

### 9.5 Flow lấy danh sách sách
1. Client gọi `GET /books`.
2. Server query DB.
3. Trả danh sách JSON.

### 9.6 Lỗi hay gặp
1. User thường vẫn gọi được POST/PATCH/DELETE.
2. Không check `available_copies <= total_copies`.
3. Không trả `404` khi id sách không tồn tại.

### 9.7 Checklist hoàn thành
1. User thường chỉ GET được.
2. Admin CRUD được đầy đủ.
3. Trả status code đúng theo từng tình huống.

---

## 10. Module 4 - Borrow/Return API

### 10.1 Mục tiêu
Hoàn thiện nghiệp vụ mượn và trả sách.

### 10.2 Endpoint
1. `POST /api/v1/borrows` (user)
2. `PATCH /api/v1/borrows/{id}/return` (user)
3. `GET /api/v1/borrows/my` (user)
4. `GET /api/v1/admin/borrows` (admin)

### 10.3 Request mẫu mượn sách
```json
{
  "book_id": 1,
  "due_date": "2026-03-20"
}
```

### 10.4 Flow mượn sách
1. User gửi `book_id`.
2. Server kiểm tra sách tồn tại.
3. Kiểm tra `available_copies > 0`.
4. Tạo bản ghi borrow với status `borrowing`.
5. Trừ `available_copies` đi 1.
6. Trả `201`.

### 10.5 Flow trả sách
1. User gọi endpoint return theo `borrow_id`.
2. Server kiểm tra bản ghi đó thuộc user hiện tại.
3. Kiểm tra chưa trả trước đó.
4. Cập nhật `returned_at`, `status = returned`.
5. Cộng `available_copies` lên 1.
6. Trả `200`.

### 10.6 Lỗi hay gặp
1. Không dùng transaction khi update 2 bảng.
2. Trả sách nhiều lần cho cùng 1 borrow.
3. User A trả borrow của user B.

### 10.7 Checklist hoàn thành
1. Mượn sách giảm tồn kho đúng.
2. Trả sách tăng tồn kho đúng.
3. Không có case âm số lượng.

---

## 11. Module 5 - External API integration

### 11.1 Mục tiêu
Chứng minh khả năng khai thác API bên thứ ba.

### 11.2 Endpoint nội bộ
`GET /api/v1/external/books/search?title=harry+potter`

### 11.3 Bạn cần làm
1. Gọi Open Library Search API từ backend.
2. Map dữ liệu gốc về format ngắn gọn.
3. Xử lý timeout/lỗi mạng.
4. Trả lỗi thân thiện nếu API ngoài không phản hồi.

### 11.4 Flow
1. Client gửi `title`.
2. Backend gửi request sang Open Library.
3. Nhận kết quả.
4. Chuẩn hóa dữ liệu mỗi item:
   `title`, `author`, `first_publish_year`, `isbn`.
5. Trả JSON.

### 11.5 Response mẫu
```json
{
  "success": true,
  "message": "External books fetched",
  "data": [
    {
      "title": "Harry Potter and the Philosopher's Stone",
      "author": "J. K. Rowling",
      "first_publish_year": 1997,
      "isbn": "9780747532699"
    }
  ]
}
```

### 11.6 Lỗi hay gặp
1. Trả thẳng raw response dài, khó dùng.
2. Không set timeout, request bị treo.
3. Để lộ API key trong code (nếu dùng provider cần key).

### 11.7 Checklist hoàn thành
1. Endpoint external trả dữ liệu thật.
2. Dữ liệu đã map gọn, dễ đọc.
3. Có xử lý fallback khi API ngoài lỗi.

---

## 12. Module 6 - Test, tài liệu, demo

### 12.1 Mục tiêu
Hoàn thiện sản phẩm nộp.

### 12.2 Bạn cần làm
1. Postman collection đầy đủ endpoint.
2. README hướng dẫn cài và chạy.
3. Ghi chú 1 trang so sánh free vs paid API sách.
4. Chuẩn bị script demo 5-10 phút.

### 12.3 Flow demo đề xuất
1. Health check.
2. Register và login.
3. Admin thêm 1 sách mới.
4. User mượn sách.
5. User trả sách.
6. Gọi external search.
7. Gọi 1 request không token để show 401.

### 12.4 Checklist hoàn thành
1. Chạy local được từ đầu đến cuối.
2. Toàn bộ endpoint bắt buộc hoạt động.
3. Có file nộp đầy đủ.

---

## 13. Bảng mapping Module -> Endpoint
1. Module 2:
   `/auth/register`, `/auth/login`, `/auth/me`
2. Module 3:
   `/books`, `/books/{id}`
3. Module 4:
   `/borrows`, `/borrows/{id}/return`, `/borrows/my`, `/admin/borrows`
4. Module 5:
   `/external/books/search`

## 14. Tiêu chí xong project (Definition of Done)
1. API chạy local ổn định.
2. Auth và role hoạt động đúng.
3. Book CRUD chạy đúng quyền.
4. Borrow/Return chạy đúng nghiệp vụ.
5. External API gọi thành công.
6. Có Postman + README + ghi chú free/paid.

## 15. Cách học hiệu quả cho người mới
1. Làm từng module, không nhảy bước.
2. Mỗi endpoint phải test Postman ngay sau khi code.
3. Khi lỗi, đọc log trước rồi mới sửa code.
4. Không tối ưu sớm, ưu tiên chạy đúng flow trước.
