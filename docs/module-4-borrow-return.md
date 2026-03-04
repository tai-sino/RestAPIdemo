# Module 4 - Borrow/Return API

## 1. Mục tiêu module
Xây nghiệp vụ mượn/trả sách và đồng bộ tồn kho chính xác.

## 2. Đã implement gì
- Endpoint:
  - `POST /api/v1/borrows` (user)
  - `PATCH /api/v1/borrows/{id}/return` (user)
  - `GET /api/v1/borrows/my` (user)
  - `GET /api/v1/admin/borrows` (admin)
- Dùng transaction cho mượn/trả để tránh lệch dữ liệu.
- Kiểm tra quyền user khi trả sách.

## 3. File chính
- `src/controllers/borrow.controller.js`
- `src/services/borrow.service.js`
- `src/routes/borrow.routes.js`

## 4. Flow chi tiết

### 4.1 Mượn sách
1. User gửi `book_id`.
2. Service check sách tồn tại.
3. Check `available_copies > 0`.
4. Trong 1 transaction:
   - Insert bản ghi `borrows`.
   - Trừ `books.available_copies - 1`.
5. Trả `201`.

### 4.2 Trả sách
1. User gọi endpoint return với `borrow_id`.
2. Service check borrow tồn tại.
3. Check borrow thuộc user hiện tại (trừ admin).
4. Check borrow chưa trả trước đó.
5. Trong 1 transaction:
   - Update borrow `status=returned`, set `returned_at`.
   - Cộng `books.available_copies + 1`.
6. Trả `200`.

### 4.3 Xem lịch sử
- `/borrows/my`: user thấy lịch sử của mình.
- `/admin/borrows`: admin thấy toàn bộ hệ thống.

## 5. Lỗi nghiệp vụ đã xử lý
- Mượn khi hết sách -> `400`.
- Trả sách không phải của mình -> `403`.
- Trả 2 lần cùng borrow -> `400`.
- borrow id không tồn tại -> `404`.

## 6. Kết luận module
Module 4 hoàn thành khi số lượng `available_copies` luôn đúng sau mượn/trả và không phát sinh case âm tồn kho.
