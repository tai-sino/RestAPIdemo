# Module 0 - Setup nền tảng

## 1. Mục tiêu module
Thiết lập backend chạy được local, có format response chuẩn và có endpoint health check.

## 2. Đã implement gì
- Khởi tạo project Node.js + Express.
- Cấu hình middleware cơ bản: `helmet`, `cors`, `morgan`, `express.json`.
- Tạo endpoint `GET /api/v1/health`.
- Chuẩn hóa response qua util `sendSuccess` và `sendError`.
- Tạo error middleware cho `404` và lỗi runtime.

## 3. File chính
- `src/server.js`
- `src/app.js`
- `src/routes/index.js`
- `src/controllers/health.controller.js`
- `src/utils/response.js`
- `src/middleware/error.middleware.js`

## 4. Flow hoạt động
1. Chạy `npm start`.
2. Server gọi `initDatabase()` trước khi listen.
3. Client gọi `/api/v1/health`.
4. Controller đọc trạng thái DB và trả JSON:
   - `app: ok`
   - `db: ok` hoặc `db: error`

## 5. Test module
Request:
```http
GET /api/v1/health
```

Kết quả mong đợi:
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

## 6. Kết luận module
Module 0 hoàn thành khi server chạy ổn và endpoint health trả `200`.
