# Module 6 - Test, tài liệu và deliverables

## 1. Mục tiêu module
Hoàn thiện bộ nộp bài và đảm bảo dự án có thể demo end-to-end.

## 2. Đã implement gì
- Script test nhanh:
  - `npm run smoke-test`
- Script reset DB:
  - `npm run reset-db`
- README hướng dẫn chạy.
- Bộ tài liệu module.
- SQL schema/seed tham khảo.
- Postman collection.

## 3. File chính
- `README.md`
- `src/scripts/smoke-test.js`
- `src/scripts/reset-db.js`
- `docs/*.md`
- `docs/postman/Simple-Library-REST-API.postman_collection.json`
- `sql/schema.sql`
- `sql/seed.sql`

## 4. Flow smoke test
Script tự chạy các bước:
1. Reset DB.
2. Health check.
3. Admin login.
4. Admin tạo sách.
5. User login.
6. User mượn sách.
7. User trả sách.
8. Gọi external endpoint.
9. Kiểm tra unauthorized request.

## 5. Kết quả kiểm thử hiện tại
- Core API pass:
  - Health/Auth/Books/Borrows đều pass.
- External endpoint:
  - Trong môi trường hiện tại trả `502` do bị giới hạn network.
  - Hành vi này đúng theo xử lý lỗi đã code.

## 6. Checklist nộp bài
- [x] Source code backend.
- [x] Database schema + seed.
- [x] Postman collection.
- [x] README.
- [x] Tài liệu giải thích từng module.
- [x] Tài liệu tổng kết cuối.

## 7. Kết luận module
Module 6 hoàn thành khi dự án chạy được local và có đầy đủ tài liệu/đầu ra để chấm demo.
