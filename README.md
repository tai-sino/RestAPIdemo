# Simple Library REST API

Backend REST API nhỏ để học Web API/REST API theo module.

## 1. Tính năng chính
- Auth: register, login, me.
- Book: list, detail, create/update/delete (admin).
- Borrow/Return: user mượn/trả sách, admin xem toàn bộ lượt mượn.
- External API: search sách từ Open Library qua endpoint nội bộ.

## 2. Công nghệ
- Node.js + Express.
- `sql.js` (SQLite file local) để chạy nhanh trong môi trường học.
- JWT cho xác thực.

## 3. Cài đặt và chạy
1. Cài package:
```bash
npm install
```
2. Tạo file `.env` từ `.env.example` (có thể dùng mặc định).
3. Reset DB:
```bash
npm run reset-db
```
4. Chạy server:
```bash
npm start
```

Server mặc định chạy ở `http://localhost:3000`.

## 4. Tài khoản seed sẵn
- Admin:
  - email: `admin@library.local`
  - password: `admin123`
- User:
  - email: `user1@example.com`
  - password: `123456`

## 5. Test nhanh
```bash
npm run smoke-test
```

Lưu ý: endpoint external có thể trả `502` nếu môi trường bị chặn mạng, đây là expected behavior.

## 6. Tài liệu module
- [Module 0](./docs/module-0-setup.md)
- [Module 1](./docs/module-1-database.md)
- [Module 2](./docs/module-2-auth.md)
- [Module 3](./docs/module-3-books.md)
- [Module 4](./docs/module-4-borrow-return.md)
- [Module 5](./docs/module-5-external-api.md)
- [Module 6](./docs/module-6-deliverables.md)
- [Final Report](./docs/final-implementation-report.md)
- [Demo Step-by-Step](./docs/demo-step-by-step.md)

## 7. Postman
- Collection: `docs/postman/Simple-Library-REST-API.postman_collection.json`

## 8. Schema SQL tham khảo
- [schema.sql](./sql/schema.sql)
- [seed.sql](./sql/seed.sql)

## 9. Frontend Dashboard
- Dashboard UI is now included and served by Express static files.
- Open: `http://localhost:3000/`
- No extra frontend install step is required.

Main UI features:
- Login/Register and auto-session via localStorage.
- Book list with keyword search, pagination, and borrow action.
- My borrows list and return action.
- External search from Open Library.
- Admin panels (visible only for admin role): create/update/delete books, view all borrows.

## 10. Frontend Demo Playbook
- Full frontend demo guide: `docs/frontend-demo-playbook.md`
## 11. Brief Speaking Script
- Short speaking script (3-5 mins): `docs/brief-demo-speaking-script.md`
## 12. Detail Demo Brief
- Detailed demo brief: `docs/detail-demo-brief.md`
## 13. Web API/REST API Research Notes
- Demo opening research notes: `docs/web-api-rest-api-demo-research.md`
## 14. API Providers Research (Free vs Paid)
- Provider comparison + selected integration scope: `docs/api-providers-free-vs-paid.md`
