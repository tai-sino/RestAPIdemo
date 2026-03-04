# API Providers (Free vs Paid) - Book APIs Research Note

## 1. Muc tieu
- Dap ung requirement: tim hieu don vi cung cap API sach theo nhom mien phi va co phi.
- Chot ro provider nao da duoc tich hop trong project de demo.

## 2. Ngay cap nhat
- Thoi diem doi chieu tai lieu chinh thuc: `2026-03-04`.

## 3. So sanh don vi cung cap API sach

| Provider | Mo hinh | Quota / gioi han | Chi phi | Do de dung | Danh gia cho bai tap |
| --- | --- | --- | --- | --- | --- |
| Open Library API | Free / public | Mac dinh `1 request/giay`; co the tang toi `3 request/giay` neu gui `User-Agent` kem email; khuyen nghi dung data dump cho nhu cau lon | Mien phi | De | Rat phu hop demo backend + external integration |
| LibraryThing Multi-Recommendations API | Freemium | Free usage toi da `25 queries/ngay`, toi da `1 query/giay`; nhu cau lon can lien he de mo rong | Free cho quy mo nho, mo rong theo thoa thuan thuong mai | Trung binh | Hop cho bai toan recommendation, khong phai nguon metadata day du nhat |
| Google Books API | Free (quota-managed) | Su dung API key/OAuth; docs neu API key cho phep theo doi quota va bao cao usage trong project | Trang docs Books API khong cong bo bang gia theo request | De | Lua chon thay the kha tot neu can nguon du lieu lon hon |
| OCLC WorldCat Search API | Paid / subscription | Quyen truy cap danh cho to chuc co goi OCLC phu hop (Cataloging and Metadata + FirstSearch/WorldCat Discovery) | Co phi theo dang subscription/licensing (thuong theo bao gia) | Kho hon | Hop production thu vien chuyen nghiep, vuot scope bai tap co ban |

## 4. Ket luan lua chon cho project nay
- Project hien tai chon **Open Library API** vi:
  - Mien phi, de tich hop nhanh cho muc tieu hoc REST.
  - Khong bat buoc quy trinh hop dong/licensing phuc tap.
  - Du de demo luong goi API ngoai + map du lieu + xu ly loi.

## 5. Mapping phan tich hop da dung trong project
- Route external endpoint: `src/routes/index.js`, `src/routes/external.routes.js`
- Controller validate query + response metadata: `src/controllers/external.controller.js`
- Service goi Open Library + timeout + fallback `502`: `src/services/external.service.js`
- Frontend goi endpoint noi bo: `public/app.js`
- Kich ban test co check external status `200` hoac `502`: `src/scripts/smoke-test.js`

## 6. Cach trinh bay requirement khi demo
- "Nhom da nghien cuu ca API free va co phi, sau do chon Open Library (free) de trien khai demo."
- "Phuong an mo rong production: thay provider bang dich vu subscription/enterprise nhu OCLC neu can SLA, support va governance cao hon."

## 7. Nguon tham khao chinh thuc
- Open Library API docs: https://openlibrary.org/developers/api
- LibraryThing Multi-Recommendations API docs: https://www.librarything.com/services/more
- Google Books API (Using API): https://developers.google.com/books/docs/v1/using
- OCLC WorldCat Search API (Who can use): https://www.oclc.org/developer/api/oclc-apis/worldcat-search-api.en.html
- OCLC support note (Search API v1 transition): https://help.oclc.org/Metadata_Services/WorldShare_Collection_Manager/Knowledge_Base_APIs/005Change_to_WorldCat_Search_API_1.0_access
