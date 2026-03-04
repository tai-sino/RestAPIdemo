# Full Requirement v1 (Library REST API - Bản Nhỏ)

## 1. Mục tiêu
Làm project nhỏ để học và demo:
- Web API/REST API.
- Tự xây REST API cơ bản.
- Khai thác 1 API sách bên thứ ba (free tier).

## 2. Tên project
Simple Library REST API

## 3. Công nghệ
- Backend: Laravel (hoặc Node.js nếu bạn muốn).
- Database: MySQL.
- Tool test: Postman.

## 4. Chức năng cần có

### 4.1 Auth
- Đăng ký.
- Đăng nhập.
- Xem thông tin tài khoản hiện tại.

### 4.2 Book
- Xem danh sách sách.
- Xem chi tiết sách.
- Thêm sách (admin).
- Sửa sách (admin).
- Xóa sách (admin).

### 4.3 Borrow/Return
- User mượn sách.
- User trả sách.
- User xem lịch sử mượn của mình.
- Admin xem tất cả lượt mượn.

### 4.4 External API (mức nhẹ)
- Gọi API sách miễn phí (Open Library).
- Tạo endpoint trong hệ thống để search sách từ API ngoài.
- Có ghi chú ngắn so sánh free vs paid (quota, chi phí, độ dễ dùng).

## 5. Endpoint tối thiểu

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Book
- `GET /api/v1/books`
- `GET /api/v1/books/{id}`
- `POST /api/v1/books` (admin)
- `PATCH /api/v1/books/{id}` (admin)
- `DELETE /api/v1/books/{id}` (admin)

### Borrow
- `POST /api/v1/borrows` (user)
- `PATCH /api/v1/borrows/{id}/return` (user)
- `GET /api/v1/borrows/my` (user)
- `GET /api/v1/admin/borrows` (admin)

### External
- `GET /api/v1/external/books/search?title=harry+potter`

## 6. Database tối thiểu

### users
- `id`
- `name`
- `email`
- `password_hash`
- `role` (`user` hoặc `admin`)
- `created_at`
- `updated_at`

### books
- `id`
- `title`
- `author`
- `isbn` (nullable)
- `published_year` (nullable)
- `total_copies`
- `available_copies`
- `created_at`
- `updated_at`

### borrows
- `id`
- `user_id`
- `book_id`
- `borrowed_at`
- `due_date`
- `returned_at` (nullable)
- `status` (`borrowing`, `returned`, `late`)
- `created_at`
- `updated_at`

## 7. Chuẩn REST cần áp dụng
- Dùng đúng method: `GET`, `POST`, `PATCH`, `DELETE`.
- URL theo resource: `/books`, `/borrows`.
- Trả dữ liệu JSON.
- Dùng status code đúng: `200`, `201`, `401`, `403`, `404`, `422`, `500`.

Ví dụ response thành công:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Ví dụ response lỗi:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

## 8. Những gì cần demo
- Demo đăng ký, đăng nhập.
- Demo admin thêm/sửa/xóa sách.
- Demo user mượn sách và trả sách.
- Demo gọi endpoint external search sách.
- Demo lỗi thường gặp: thiếu token, sai dữ liệu input.

## 9. Sản phẩm nộp
- Source code backend.
- File SQL hoặc migration.
- Postman collection.
- File README hướng dẫn chạy.
- 1 trang ghi chú ngắn: so sánh API sách free vs paid.

## 10. Kết quả mong đợi
Chạy local thành công, gọi được đầy đủ endpoint ở mục 5 và demo được luồng auth + book CRUD + borrow/return.
