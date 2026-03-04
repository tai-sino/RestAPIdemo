# Module 1 - Database schema

## 1. Mục tiêu module
Tạo cấu trúc dữ liệu cho user, book, borrow và có dữ liệu seed để test API ngay.

## 2. Đã implement gì
- Thiết kế schema gồm 3 bảng:
  - `users`
  - `books`
  - `borrows`
- Tạo index cơ bản cho truy vấn nhanh.
- Tạo seed data:
  - 1 admin.
  - 1 user.
  - 6 sách mẫu.
- Hỗ trợ reset database bằng script.

## 3. File chính
- `src/db/migrations.js`
- `src/db/seed.js`
- `src/db/sqlite.js`
- `src/scripts/reset-db.js`
- `sql/schema.sql`
- `sql/seed.sql`

## 4. Flow hoạt động
1. `initDatabase()` chạy khi server start.
2. Nếu chưa có file DB:
   - Tạo DB mới.
   - Chạy migration.
   - Chạy seed.
3. Nếu DB đã có:
   - Mở DB hiện có.
   - Đảm bảo schema tồn tại (`CREATE TABLE IF NOT EXISTS`).

## 5. Nghiệp vụ DB quan trọng
- `users.email` là unique.
- `books.available_copies` luôn `<= total_copies`.
- `borrows.book_id` dùng `ON DELETE RESTRICT` để tránh xóa sách đang có lịch sử mượn.

## 6. Lệnh dùng trong module
Reset DB:
```bash
npm run reset-db
```

## 7. Kết luận module
Module 1 hoàn thành khi DB được tạo/seed thành công và có dữ liệu mẫu để test các API tiếp theo.
