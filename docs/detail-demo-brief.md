# Detail Demo Brief - Library Command Center

## 1. Mục tiêu buổi demo
- Chứng minh project chạy end-to-end bằng frontend.
- Thể hiện rõ 4 trục chính:
  - Auth + phân quyền.
  - Quản lý sách (admin).
  - Mượn/trả sách (business flow).
  - Tích hợp external API.

## 2. Thời lượng đề xuất
- Tổng: **8-12 phút**.
- Chia thời gian:
  - Mở đầu + setup: 1 phút.
  - Auth + role: 2 phút.
  - Book CRUD (admin): 2 phút.
  - Borrow/Return (user): 3 phút.
  - External API + chốt: 2 phút.

## 3. Chuẩn bị trước khi vào lớp
1. Chạy project:
```bash
npm install
npm run reset-db
npm start
```
2. Mở frontend: `http://localhost:3000/`
3. Tài khoản demo:
   - Admin: `admin@library.local / admin123`
   - User: `user1@example.com / 123456`
4. Mở sẵn 1 tab repo GitHub (để chứng minh source):
   - `https://github.com/tai-sino/RestAPIdemo`

## 4. Kịch bản nói demo chi tiết

### Bước 1: Mở đầu (20-30 giây)
**Nói:**
"Đây là Library Command Center. Frontend gọi REST API của backend Node.js/Express. Em sẽ demo theo luồng thật: đăng nhập, phân quyền admin/user, quản lý sách, mượn/trả, và gọi API ngoài."

### Bước 2: Giới thiệu giao diện (30 giây)
**Thao tác:**
- Chỉ từng khu vực trên UI: Xác thực, Phiên hiện tại, Danh sách sách, Lượt mượn, External Search.

**Nói:**
"UI đã Việt hóa để demo trực quan. Admin sẽ thấy thêm panel quản trị; user thường sẽ không thấy."

### Bước 3: Login admin + phân quyền (1 phút)
**Thao tác:**
- Login bằng `admin@library.local / admin123`.

**Expected:**
- Badge đổi sang trạng thái đã đăng nhập quản trị viên.
- Panel `Quản lý sách (Admin)` và `Tất cả lượt mượn (Admin)` hiển thị.

**Nói:**
"Sau login, frontend nhận JWT token, lưu session, rồi gọi lại API để load dữ liệu theo quyền."

### Bước 4: Admin thao tác sách (2 phút)
**Thao tác:**
1. Tạo 1 sách mới ở form `Tạo sách mới`.
2. Cập nhật sách vừa tạo ở form `Cập nhật sách`.
3. (Tuỳ chọn) Xóa một sách test bằng `ID`.

**Expected:**
- Toast thành công.
- Bảng sách và thống kê cập nhật ngay.

**Nói:**
"Đây là endpoint có role guard admin. User thường sẽ không truy cập được."

### Bước 5: Chuyển sang user thường (1 phút)
**Thao tác:**
- Đăng xuất admin.
- Login user `user1@example.com / 123456`.

**Expected:**
- Panel admin biến mất.
- Chỉ còn tính năng user.

**Nói:**
"Cùng một UI nhưng hệ thống ẩn/hiện chức năng theo role, đồng thời backend vẫn kiểm soát quyền ở API."

### Bước 6: Borrow flow (1-1.5 phút)
**Thao tác:**
1. Chọn `Hạn trả mặc định`.
2. Bấm `Mượn` ở một sách còn bản.

**Expected:**
- Xuất hiện record mới ở `Lượt mượn của tôi`.
- `Bản còn sẵn` của sách giảm.

**Nói:**
"Khi mượn, hệ thống tạo borrow record và trừ tồn kho khả dụng."

### Bước 7: Return flow (1-1.5 phút)
**Thao tác:**
- Trong `Lượt mượn của tôi`, bấm `Trả sách`.

**Expected:**
- Trạng thái chuyển `đã trả`.
- Số bản khả dụng tăng lại.

**Nói:**
"Luồng trả sách cập nhật cả trạng thái borrow và inventory, bảo toàn business logic."

### Bước 8: External API (1 phút)
**Thao tác:**
- Nhập từ khóa `harry potter` ở `Tìm sách ngoài hệ thống`.
- Bấm `Tìm kiếm`.

**Expected:**
- Có dữ liệu: hiển thị title/author/year.
- Nếu môi trường chặn mạng: có thể trả lỗi `502` (đây là expected fallback).

**Nói:**
"App gọi endpoint nội bộ rồi backend gọi Open Library. Nếu upstream lỗi/mạng chặn, hệ thống trả lỗi có kiểm soát."

### Bước 9: Kết luận (20-30 giây)
**Nói:**
"Project đã cover đầy đủ auth, role-based access, CRUD sách, borrow/return và tích hợp external API. Frontend cập nhật realtime sau mỗi thao tác."

## 5. Demo lỗi chủ động (nếu còn thời gian)
1. Login sai mật khẩu -> nhận thông báo lỗi xác thực.
2. Không login mà thao tác mượn -> yêu cầu đăng nhập.
3. External bị `502` -> giải thích upstream/network fallback.

## 6. Câu trả lời nhanh khi bị hỏi
- "REST ở đâu?"
  - URL theo resource, đúng method GET/POST/PATCH/DELETE, response JSON + status code chuẩn.
- "Security ở đâu?"
  - JWT bearer token + middleware auth + role middleware.
- "Business logic chính?"
  - Borrow/return thay đổi đồng thời borrow status và available copies.

## 7. Checklist 30 giây trước khi bắt đầu
1. Server đang chạy, mở được `http://localhost:3000/`.
2. Đăng nhập được cả admin và user.
3. Borrow/Return chạy được ít nhất 1 lần thử trước giờ demo.
4. Có sẵn phương án nói nếu external trả `502`.
