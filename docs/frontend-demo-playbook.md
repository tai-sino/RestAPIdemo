# Frontend Demo Playbook - Library Command Center

## 1. Mục tiêu tài liệu
Tài liệu này dùng để demo toàn bộ project bằng frontend tại `http://localhost:3000/`, đồng thời giải thích:
- Mỗi tính năng hoạt động như thế nào.
- Luồng dữ liệu UI -> API -> database -> UI.
- Cách trình bày demo mạch lạc trong 10-20 phút.

## 2. Phạm vi tính năng đã có trên frontend
1. Auth:
   - Register.
   - Login.
   - Session restore sau khi refresh trang.
   - Logout.
2. Book:
   - List books.
   - Search theo title/author.
   - Pagination.
3. Borrow/Return:
   - Borrow book (user/admin đều có thể mượn nếu đã login).
   - Return book (chính user đó, hoặc admin).
   - Xem My Borrows.
4. External API:
   - Search sách từ Open Library qua endpoint nội bộ.
5. Admin dashboard:
   - Create/Update/Delete book.
   - Xem toàn bộ borrow records.
   - Return thay cho user trong bảng All Borrows.
6. UX hỗ trợ demo:
   - Loading state trên button.
   - Toast thông báo success/error/warning.
   - Ẩn/hiện panel theo role.

## 3. Chuẩn bị trước khi demo

### 3.1 Chạy project
```bash
npm install
npm run reset-db
npm start
```

Mở trình duyệt:
- Frontend: `http://localhost:3000/`
- API base (tham chiếu): `http://localhost:3000/api/v1`

### 3.2 Tài khoản seed
- Admin:
  - Email: `admin@library.local`
  - Password: `admin123`
- User:
  - Email: `user1@example.com`
  - Password: `123456`

### 3.3 Kỳ vọng mạng
- External search có thể trả `502` nếu môi trường chặn internet.
- Đây là hành vi đã được xử lý dự kiến (expected behavior), không phải lỗi app nội bộ.

## 4. Bản đồ giao diện và quyền

### 4.1 Khu vực chính
1. `Authentication`:
   - Form Login.
   - Form Register.
2. `Current Session`:
   - Hiển thị Name/Email/Role.
3. `Books`:
   - Search + bảng sách + Borrow button.
   - Default Due Date.
   - Prev/Next page.
4. `My Borrows`:
   - Bảng lịch sử mượn của user hiện tại.
   - Nút Return cho bản ghi đang `borrowing`.
5. `External Search (Open Library)`:
   - Search theo tiêu đề, hiển thị danh sách ngoài.
6. `Admin Book Actions` (chỉ admin):
   - Create book.
   - Update book.
   - Delete book.
7. `All Borrows (Admin)` (chỉ admin):
   - Xem toàn bộ lượt mượn.
   - Return thay user.

### 4.2 Quy tắc phân quyền hiển thị
1. Guest:
   - Không có token.
   - Không thấy admin panels.
   - Không mượn/trả được.
2. User:
   - Thấy My Borrows, Books, External Search.
   - Không thấy admin panels.
3. Admin:
   - Thấy toàn bộ UI.
   - Gọi được các endpoint admin.

## 5. Luồng kỹ thuật tổng quát của frontend

## 5.1 Bootstrap khi mở trang
1. `loadSession()`:
   - Đọc token/user từ `localStorage`.
2. `syncProfile()`:
   - Nếu có token thì gọi `GET /api/v1/auth/me`.
   - Token hợp lệ: cập nhật `state.user`.
   - Token hết hạn/sai: xoá session và báo toast.
3. `refreshAllData()`:
   - `GET /books`.
   - Nếu đã login: `GET /borrows/my`.
   - Nếu admin: `GET /admin/borrows`.
4. Render:
   - Cập nhật panel theo role.
   - Render bảng, metric cards, trạng thái nút.

### 5.2 Mẫu gọi API chung
1. Toàn bộ request đi qua `apiRequest(path, options)`.
2. Nếu `auth: true`, frontend tự gắn header:
   - `Authorization: Bearer <token>`
3. Nếu request lỗi:
   - Lấy message từ payload backend.
   - Ném lỗi để handler UI hiện toast.

### 5.3 Luồng sau mỗi thao tác ghi dữ liệu
Sau các action thay đổi dữ liệu (borrow/return/create/update/delete), frontend gọi lại `refreshAllData()` để đảm bảo:
- Bảng Books, My Borrows, All Borrows đồng bộ ngay.
- Metrics cập nhật ngay.
- Không cần reload trang.

## 6. Giải thích từng feature (how it works + flow)

### 6.1 Register
1. UI action:
   - Nhập Name, Email, Password trong form `Create account`.
   - Click `Create account`.
2. API:
   - `POST /api/v1/auth/register`
3. Validation backend:
   - `name` >= 2 ký tự.
   - `email` hợp lệ.
   - `password` >= 6 ký tự.
   - Email chưa tồn tại.
4. Kết quả:
   - Thành công: toast "Register successful. You can login now."
   - Thất bại: toast message lỗi từ backend.
5. Data flow:
   - users table có bản ghi mới với role mặc định `user`.

### 6.2 Login
1. UI action:
   - Nhập Email + Password ở form Login.
2. API:
   - `POST /api/v1/auth/login`
3. Backend trả:
   - `access_token`
   - `user` (id, name, email, role)
4. Frontend xử lý:
   - Lưu token + user vào state.
   - Lưu session vào `localStorage`.
   - Gọi `refreshAllData()`.
5. Kết quả nhìn thấy:
   - Badge trên header đổi thành `USER signed in` hoặc `ADMIN signed in`.
   - Current Session cập nhật thông tin.
   - Admin panel hiện ra nếu role là admin.

### 6.3 Session restore sau refresh trang
1. Frontend đọc `localStorage`.
2. Gọi `GET /auth/me` để xác thực token hiện tại.
3. Nếu token còn hợp lệ:
   - User giữ trạng thái login.
4. Nếu token hết hạn:
   - Xoá session.
   - Trả về Guest mode.

### 6.4 Logout
1. UI action:
   - Click `Logout`.
2. Frontend xử lý:
   - Xoá token + user trong state.
   - Xoá `localStorage`.
   - Reset dữ liệu nhạy cảm (my borrows, all borrows).
3. Kết quả:
   - Quay về Guest mode ngay, không cần reload.

### 6.5 List Books + Search + Pagination
1. API list:
   - `GET /api/v1/books?page=<n>&limit=<n>&keyword=<text>`
2. Search:
   - Nhập từ khoá ở ô `Search title/author`.
   - Click `Search` hoặc Enter.
   - Frontend set page về 1 và gọi API.
3. Pagination:
   - `Prev`/`Next` dựa trên `meta.page`, `meta.limit`, `meta.total`.
4. Metrics liên quan:
   - `Total Books`: lấy từ `meta.total`.
   - `Available Copies`: tổng `available_copies` của trang hiện tại.

### 6.6 Borrow Book
1. Điều kiện:
   - Phải login.
   - Sách còn `available_copies > 0`.
2. UI action:
   - Chọn `Default Due Date`.
   - Click `Borrow` ở dòng sách.
3. API:
   - `POST /api/v1/borrows`
   - Body: `{ "book_id": <id>, "due_date": "YYYY-MM-DD" }`
4. Backend business:
   - Tạo borrow record `status = borrowing`.
   - Giảm `books.available_copies` đi 1.
5. UI sau thành công:
   - Bảng Books và My Borrows được refresh.
   - Nút borrow có thể bị disable nếu hết bản.

### 6.7 My Borrows + Return
1. API list:
   - `GET /api/v1/borrows/my`
2. Return flow:
   - Click `Return` trên dòng đang `borrowing`.
   - API: `PATCH /api/v1/borrows/{id}/return`
3. Backend business:
   - Set `returned_at`, `status = returned`.
   - Tăng `books.available_copies` thêm 1.
4. UI kết quả:
   - Dòng borrow đổi trạng thái `returned`.
   - Nút Return bị disable cho record đã trả.

### 6.8 External Search (Open Library)
1. UI action:
   - Nhập title.
   - Click `Search`.
2. API:
   - `GET /api/v1/external/books/search?title=<keyword>&limit=8`
3. Backend:
   - Gọi Open Library.
   - Map dữ liệu về format chuẩn.
4. Kết quả:
   - Hiển thị danh sách title, author, first publish year.
   - Nếu mạng lỗi/chặn: toast lỗi, có thể nhận status `502`.

### 6.9 Admin - Create Book
1. Điều kiện:
   - User role phải là `admin`.
2. UI action:
   - Điền form `Create Book`.
3. API:
   - `POST /api/v1/books`
4. Business:
   - Tạo bản ghi books.
   - Nếu không gửi `available_copies`, backend mặc định bằng `total_copies`.
5. Kết quả:
   - Book mới xuất hiện trong danh sách sau refresh tự động.

### 6.10 Admin - Update Book
1. UI action:
   - Nhập `Book ID`.
   - Nhập ít nhất 1 field muốn sửa.
2. API:
   - `PATCH /api/v1/books/{id}`
3. Business rule:
   - `available_copies` không được lớn hơn `total_copies`.
4. Kết quả:
   - Dòng book được cập nhật ngay sau refresh.

### 6.11 Admin - Delete Book
1. UI action:
   - Nhập `Book ID`.
   - Click `Delete`.
2. API:
   - `DELETE /api/v1/books/{id}`
3. Lưu ý:
   - Nếu sách đang được tham chiếu bởi borrow record, backend có thể trả `409`.
4. Kết quả:
   - Xóa thành công: sách biến mất khỏi list.

### 6.12 Admin - All Borrows + Return on behalf
1. API:
   - `GET /api/v1/admin/borrows`
2. UI:
   - Bảng hiển thị user + book + status + due date.
3. Action:
   - Admin bấm `Return` trên bất kỳ borrow record đang mở.
4. API return dùng chung:
   - `PATCH /api/v1/borrows/{id}/return`
5. Điểm demo quan trọng:
   - Chứng minh quyền admin can thiệp toàn hệ thống.

## 7. Kịch bản demo đầy đủ (đề xuất 15 phút)

### Bước 1: Khởi động và giới thiệu UI (1 phút)
1. Mở `http://localhost:3000/`.
2. Nói nhanh bố cục: Auth, Books, My Borrows, External, Admin-only panels.

### Bước 2: Login bằng admin (1 phút)
1. Đăng nhập `admin@library.local / admin123`.
2. Chỉ ra:
   - Badge đổi sang ADMIN.
   - Admin panel xuất hiện.

### Bước 3: Admin tạo 1 sách mới (2 phút)
1. Điền form Create Book.
2. Submit.
3. Giải thích:
   - Chỉ admin gọi được endpoint create.
   - Sách mới hiện ngay do auto refresh.

### Bước 4: Admin cập nhật sách vừa tạo (1 phút)
1. Điền Book ID và 1-2 field.
2. Submit.
3. Chỉ ra dữ liệu thay đổi trên bảng.

### Bước 5: Logout admin, login user (1 phút)
1. Logout.
2. Login `user1@example.com / 123456`.
3. Chỉ ra:
   - Admin panel biến mất.
   - Chứng minh phân quyền UI + API.

### Bước 6: User search và borrow sách (2 phút)
1. Search theo title/author.
2. Chọn due date.
3. Click Borrow.
4. Giải thích:
   - available copies giảm.
   - record mới xuất hiện ở My Borrows.

### Bước 7: User return sách (1 phút)
1. Trong My Borrows, click Return.
2. Giải thích:
   - status chuyển `returned`.
   - available copies tăng lại.

### Bước 8: External search (2 phút)
1. Nhập ví dụ `harry potter`.
2. Click Search.
3. Nếu thành công:
   - Chỉ ra title, authors, first publish year.
4. Nếu `502`:
   - Giải thích môi trường mạng chặn, backend đã fallback đúng.

### Bước 9: Demo register nhanh (2 phút)
1. Tạo user mới bằng Register form.
2. Login user mới để xác nhận account hoạt động.

### Bước 10: Kết thúc bằng thông điệp kỹ thuật (2 phút)
1. REST chuẩn:
   - URL theo resource.
   - Method đúng.
   - JSON + status code rõ ràng.
2. Security:
   - JWT bearer token.
   - Role-based access control.
3. Business:
   - Borrow/return cập nhật inventory theo transaction.

## 8. Demo lỗi chủ động (để gây ấn tượng tốt)
1. Login sai mật khẩu:
   - Kỳ vọng: toast lỗi "Invalid credentials."
2. User thường cố thao tác admin:
   - Không có panel admin trên UI.
   - Nếu gọi API thủ công sẽ nhận `403`.
3. Borrow khi chưa login:
   - Button Borrow bị disable, hoặc báo "Please login before borrowing."
4. External trong môi trường chặn mạng:
   - Có thể thấy `502`, chứng minh app có xử lý lỗi upstream.

## 9. Quick checklist trước khi thuyết trình
1. `npm run reset-db` đã chạy.
2. Đăng nhập được cả admin và user.
3. Create/update/delete book hoạt động với admin.
4. Borrow/return hoạt động với user.
5. External search đã thử ít nhất 1 lần.
6. Có phương án giải thích nếu external trả `502`.

## 10. Tham chiếu code để giải thích sâu
- UI layout: `public/index.html`
- Frontend logic/state/API: `public/app.js`
- Styling/UX: `public/styles.css`
- Static serving: `src/app.js`
- API routes: `src/routes/index.js`
- Auth controller: `src/controllers/auth.controller.js`
- Book controller: `src/controllers/book.controller.js`
- Borrow controller: `src/controllers/borrow.controller.js`
- External controller: `src/controllers/external.controller.js`
