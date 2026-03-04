# Brief Demo Speaking Script (3-5 minutes)

## 1. Before demo
- Run:
```bash
npm run reset-db
npm start
```
- Open: `http://localhost:3000/`
- Seed accounts:
  - Admin: `admin@library.local / admin123`
  - User: `user1@example.com / 123456`

## 2. Script to speak (can read almost verbatim)

### Opening (20-30s)
"Day la Library Command Center. Project gom frontend va REST API cho bai toan quan ly sach. Em se demo nhanh luong that: login, role-based action, muon/tra sach, va external API."

### Show UI layout (20s)
"Trang nay la frontend chay tai localhost. Ben trai la auth va profile session. Ben phai la books, my borrows, external search. Neu login admin se co them admin panels."

### Login as admin (40s)
"Em login bang tai khoan admin."
"Sau login, he thong tra JWT token, frontend luu session, va tu load lai du lieu."
"Minh thay badge ADMIN va admin panel da hien."

### Admin create/update book (60s)
"Em tao 1 cuon sach moi trong panel Create Book."
"Action nay chi admin duoc phep."
"Sau khi tao, books list cap nhat ngay."
"Em update nhanh cuon vua tao de cho thay flow PATCH va dong bo data."

### Switch to user (40s)
"Em logout admin va login user thuong."
"Luc nay admin panel bien mat, chung minh role-based UI + API."

### Borrow + return (70-90s)
"User chon due date va bam Borrow o mot cuon sach con ban."
"He thong tao borrow record, available copies giam, va my borrows tang."
"Gio em bam Return."
"Status chuyen returned, va available copies tang lai."

### External API search (40s)
"Em search external voi tu khoa 'harry potter'."
"Backend goi Open Library qua endpoint noi bo va map du lieu ve giao dien."
"Neu moi truong bi chan mang thi co the tra 502, day la expected fallback."

### Closing (20-30s)
"Tong ket: project da co auth, role-based access, CRUD books, borrow/return, va external integration. Frontend cap nhat realtime sau moi thao tac."

## 3. Backup lines for common questions
- "REST o dau?":
  - "URL theo resource, method dung chuan GET/POST/PATCH/DELETE, response JSON + status code ro rang."
- "Bao mat o dau?":
  - "JWT bearer token + middleware requireAuth + requireRole."
- "Business logic o dau?":
  - "Borrow/return thay doi borrow status va inventory available_copies theo service layer."

## 4. If demo time is only 2 minutes
1. Login admin.
2. Create 1 book.
3. Logout -> login user.
4. Borrow + return 1 book.
5. External search 1 keyword.
