# Module 5 - External API Integration

## 1. Mục tiêu module
Demo khai thác API sách bên thứ ba thông qua endpoint nội bộ của project.

## 2. Đã implement gì
- Endpoint nội bộ:
  - `GET /api/v1/external/books/search?title=...&limit=...`
- Backend gọi Open Library API:
  - `GET https://openlibrary.org/search.json`
- Map dữ liệu trả về format ngắn gọn:
  - `title`
  - `author`
  - `first_publish_year`
  - `isbn`
- Có timeout và trả lỗi `502` khi external API lỗi.

## 3. File chính
- `src/controllers/external.controller.js`
- `src/services/external.service.js`
- `src/routes/external.routes.js`

## 4. Flow chi tiết
1. Client gọi endpoint nội bộ với query `title`.
2. Controller validate query.
3. Service dùng axios gọi Open Library.
4. Service map dữ liệu raw thành object gọn.
5. Trả response thống nhất cho client.

## 5. Ví dụ request
```http
GET /api/v1/external/books/search?title=harry+potter&limit=5
```

## 6. Kết quả khi network bị chặn
Trong môi trường không có internet, endpoint sẽ trả:
- `502 Bad Gateway`
- Message: `Failed to fetch data from external API.`

Đây là expected behavior và đã được xử lý chủ động trong code.

## 7. Kết luận module
Module 5 hoàn thành khi endpoint external hoạt động ổn định (200 khi có mạng, 502 khi lỗi mạng nhưng không làm crash server).
