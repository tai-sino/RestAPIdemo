# Module 3 - Book API

## 1. Mục tiêu module
Hoàn thiện quản lý sách (CRUD) và phân quyền rõ ràng:
- User thường: chỉ được xem.
- Admin: được thêm/sửa/xóa.

## 2. Đã implement gì
- Endpoint:
  - `GET /api/v1/books`
  - `GET /api/v1/books/{id}`
  - `POST /api/v1/books` (admin)
  - `PATCH /api/v1/books/{id}` (admin)
  - `DELETE /api/v1/books/{id}` (admin)
- Validation dữ liệu đầu vào.
- Tìm kiếm + phân trang trong endpoint list.
- Middleware role `admin` cho endpoint ghi.

## 3. File chính
- `src/controllers/book.controller.js`
- `src/services/book.service.js`
- `src/routes/book.routes.js`
- `src/middleware/role.middleware.js`

## 4. Flow chi tiết

### 4.1 List books
1. Client gọi `GET /books?page=1&limit=10&keyword=...`.
2. Service query DB theo keyword (title/author).
3. Trả `data` + `meta` (page, limit, total).

### 4.2 Create book (admin)
1. Admin gửi token + payload.
2. Middleware xác thực token.
3. Middleware check role admin.
4. Validate `title/author/total_copies`.
5. Insert DB và trả `201`.

### 4.3 Update/Delete book (admin)
1. Check id hợp lệ.
2. Check sách tồn tại.
3. Update hoặc delete.
4. Trả response thành công.

## 5. Rule dữ liệu quan trọng
- `total_copies >= 0`.
- `available_copies >= 0`.
- `available_copies <= total_copies`.

## 6. Kết luận module
Module 3 hoàn thành khi:
1. User thường chỉ GET được.
2. Admin CRUD được sách.
3. Trả status code đúng (`200/201/401/403/404/422`).
