# Module 2 - Auth API

## 1. Mục tiêu module
Cho phép user đăng ký, đăng nhập, lấy thông tin cá nhân và bảo vệ endpoint bằng JWT.

## 2. Đã implement gì
- Endpoint:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
- Hash password bằng `bcryptjs`.
- Tạo token JWT khi login.
- Middleware `requireAuth` để xác thực token.

## 3. File chính
- `src/controllers/auth.controller.js`
- `src/services/auth.service.js`
- `src/middleware/auth.middleware.js`
- `src/routes/auth.routes.js`

## 4. Flow chi tiết

### 4.1 Register
1. Client gửi `name/email/password`.
2. Controller validate dữ liệu.
3. Service kiểm tra trùng email.
4. Hash password và lưu user mới.
5. Trả user (không trả password hash).

### 4.2 Login
1. Client gửi `email/password`.
2. Service tìm user theo email.
3. So sánh password với hash.
4. Tạo JWT token.
5. Trả token + user profile.

### 4.3 Me
1. Client gửi header `Authorization: Bearer <token>`.
2. Middleware verify token.
3. Lấy user từ DB.
4. Trả thông tin user hiện tại.

## 5. Ví dụ request nhanh
Register:
```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "123456"
}
```

Login:
```json
{
  "email": "demo@example.com",
  "password": "123456"
}
```

## 6. Lỗi chính đã xử lý
- Email trùng -> `422`.
- Sai mật khẩu -> `401`.
- Thiếu token -> `401`.
- Token hết hạn/không hợp lệ -> `401`.

## 7. Kết luận module
Module 2 hoàn thành khi login lấy được token và gọi `/auth/me` thành công bằng token đó.
