# Web API / REST API - Research Notes for Demo Opening

## 1. Mục tiêu tài liệu
Tài liệu này giúp bạn mở đầu buổi demo một cách có nền tảng:
- Trình bày lịch sử Web API/REST API theo mốc thời gian.
- Giải thích đúng bản chất kỹ thuật của REST.
- Nối lý thuyết với demo project Library Command Center.

## 2. Định nghĩa nhanh để mở bài

### 2.1 API là gì?
API (Application Programming Interface) là tập quy tắc cho phép các hệ thống trao đổi dữ liệu/chức năng với nhau.

### 2.2 Web API là gì?
Web API là API hoạt động trên giao thức web (thường là HTTP/HTTPS), client gọi server qua request/response.

### 2.3 REST API là gì?
REST API là Web API được thiết kế theo các ràng buộc kiến trúc REST (do Roy Fielding mô tả), không chỉ đơn giản là dùng HTTP + JSON.

## 3. Lịch sử tóm tắt (timeline quan trọng)

1. 1989: Tim Berners-Lee viết proposal tại CERN cho hệ thống hypertext phân tán, nền tảng cho Web sau này.
2. 1991: Website đầu tiên `info.cern.ch` được đưa lên.
3. 1993: CERN đưa phần mềm Web vào public domain, tạo điều kiện bùng nổ hệ sinh thái web mở.
4. 1999: XML-RPC được công bố, đại diện sớm cho mô hình gọi hàm từ xa qua HTTP.
5. 2000: SOAP 1.1 được công bố (W3C Note), thúc đẩy Web Services theo hướng message/RPC.
6. 2000: Roy Fielding giới thiệu REST trong luận án tiến sĩ (chương 5).
7. 2003: SOAP 1.2 trở thành W3C Recommendation.
8. 2012: OAuth 2.0 (RFC 6749) và Bearer Token (RFC 6750) chuẩn hóa mô hình ủy quyền phổ biến cho API.
9. 2015: HTTP/2 (RFC 7540) và JWT (RFC 7519) phổ biến mạnh trong API hiện đại.
10. 2017: JSON được chuẩn hóa ổn định trong RFC 8259.
11. 2018: TLS 1.3 (RFC 8446) giúp truyền tải API an toàn và nhanh hơn.
12. 2022: Bộ chuẩn HTTP mới (RFC 9110) và HTTP/3 (RFC 9114).
13. 2025: OpenAPI phát hành v3.2.0 (theo trang spec chính thức của OAI).

## 4. REST thực sự gồm những gì?

Theo Roy Fielding, REST được dẫn xuất từ các ràng buộc kiến trúc:
1. Client-Server.
2. Stateless.
3. Cache.
4. Uniform Interface.
5. Layered System.
6. Code-on-Demand (tùy chọn).

Lưu ý quan trọng khi nói demo:
- REST là **architectural style**, không phải protocol.
- Dùng HTTP method + JSON chưa đủ để gọi là REST "chuẩn", vì còn phụ thuộc các constraint ở trên.

## 5. Uniform Interface trong REST (điểm hay bị bỏ sót)
Fielding nêu 4 phần chính của Uniform Interface:
1. Identification of resources.
2. Manipulation of resources through representations.
3. Self-descriptive messages.
4. Hypermedia as the engine of application state (HATEOAS).

Trong thực tế, nhiều "REST API" hiện nay thường chỉ đạt một phần (REST-like hoặc HTTP API).

## 6. HTTP semantics cần nói ngắn gọn khi demo

Theo RFC 9110:
1. Safe methods: GET/HEAD/OPTIONS/TRACE là read-only theo nghĩa nghiệp vụ.
2. Idempotent methods: PUT, DELETE và các safe method là idempotent.
3. Caching: method phải cho phép cache và tuân thủ điều kiện cache.

Bạn có thể nói một câu:
"API của em tuân thủ semantics HTTP: phân biệt rõ GET để đọc, POST để tạo, PATCH để cập nhật từng phần, DELETE để xóa."

## 7. REST vs RPC vs SOAP (nói ngắn, dễ hiểu)
1. RPC/XML-RPC: tập trung vào gọi hàm từ xa (`methodName`, function style).
2. SOAP: message protocol XML chuẩn hóa mạnh, thiên về enterprise integration.
3. REST: tài nguyên + representation + semantics HTTP + khả năng scale qua cache/layered system.

## 8. Bảo mật API - các điểm phải nêu

### 8.1 Cơ chế authn/authz phổ biến
1. OAuth 2.0 cho ủy quyền.
2. Bearer token cho truy cập resource.
3. JWT thường dùng để mang claims phiên đăng nhập.

### 8.2 Nguyên tắc thực hành
1. Luôn dùng HTTPS/TLS.
2. Xác thực + phân quyền theo role.
3. Validate input và trả status code đúng.
4. Không lộ thông tin nhạy cảm trong lỗi.
5. Inventory endpoint/version rõ ràng.

### 8.3 Góc nhìn rủi ro
OWASP API Top 10 (2023) nhấn mạnh nhóm lỗi authorization, misconfiguration, inventory management.

## 9. Mapping lý thuyết vào project của bạn

Project hiện tại minh họa tốt:
1. Resource-based URL:
   - `/api/v1/books`
   - `/api/v1/borrows`
2. HTTP methods đúng mục đích:
   - `GET /books`
   - `POST /borrows`
   - `PATCH /borrows/{id}/return`
3. Auth + role:
   - `requireAuth`
   - `requireRole('admin')`
4. Stateless token:
   - Header `Authorization: Bearer <token>`
5. JSON response thống nhất:
   - `success`, `message`, `data`, `meta`

## 10. Script mở đầu 2-3 phút (dùng trước phần demo thao tác)

"Trước khi demo chức năng, em nói nhanh về nền tảng kỹ thuật.  
API là giao diện cho các hệ thống nói chuyện với nhau.  
Web API là API chạy trên HTTP/HTTPS.  
REST API là Web API được thiết kế theo các ràng buộc kiến trúc REST do Roy Fielding đưa ra năm 2000.  
Điểm cốt lõi không chỉ là JSON hay URL đẹp, mà là các nguyên tắc như stateless, cache, uniform interface và layered system để tăng khả năng mở rộng và tách biệt client-server.  
Trong project này, em áp dụng theo mô hình tài nguyên `/books`, `/borrows`, dùng đúng method GET/POST/PATCH/DELETE, phân quyền bằng JWT bearer token và role admin/user.  
Vì vậy phần demo sau sẽ thể hiện rõ cả lý thuyết REST lẫn luồng nghiệp vụ thực tế."  

## 11. Câu hỏi hay gặp và câu trả lời ngắn

1. "REST có phải là chuẩn/protocol không?"
   - Không, REST là architectural style.
2. "Dùng HTTP + JSON có phải REST chưa?"
   - Chưa chắc; còn phụ thuộc việc có đáp ứng các constraint REST hay không.
3. "Vì sao project này phù hợp để học REST API?"
   - Có đủ resource modeling, method semantics, auth/role, status code và business flow mượn/trả.

## 12. Nguồn chính (primary sources)
1. Roy Fielding dissertation (REST, 2000):
   - https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
   - https://roy.gbiv.com/pubs/dissertation/introduction.htm
2. HTTP Semantics (RFC 9110, 2022):
   - https://www.rfc-editor.org/rfc/rfc9110
3. URI Generic Syntax (RFC 3986, 2005):
   - https://www.rfc-editor.org/info/rfc3986
4. JSON format (RFC 8259, 2017):
   - https://www.rfc-editor.org/rfc/rfc8259
5. HTTP/2 (RFC 7540, 2015):
   - https://www.rfc-editor.org/info/rfc7540
6. HTTP/3 (RFC 9114, 2022):
   - https://www.rfc-editor.org/rfc/rfc9114
7. OAuth 2.0 (RFC 6749, 2012):
   - https://www.rfc-editor.org/info/rfc6749
8. Bearer Token (RFC 6750, 2012):
   - https://www.rfc-editor.org/info/rfc6750
9. JWT (RFC 7519, 2015):
   - https://www.rfc-editor.org/info/rfc7519
10. TLS 1.3 (RFC 8446, 2018):
    - https://www.rfc-editor.org/info/rfc8446
11. CERN - Birth of the Web:
    - https://home.cern/science/computing/birth-web
    - https://www.w3.org/History/1989/proposal-msw.html
12. SOAP:
    - SOAP 1.1 Note (2000): https://www.w3.org/TR/2000/NOTE-SOAP-20000508/
    - SOAP 1.2 Recommendation (2003): https://www.w3.org/news/2003/soap-version-12-is-a-w3c-recommendation/
13. XML-RPC specification:
    - https://xmlrpc.com/spec.html
14. OpenAPI official publications:
    - https://spec.openapis.org/oas/
    - https://www.openapis.org/faq
15. OWASP API Security Top 10 (2023):
    - https://owasp.org/API-Security/editions/2023/en/0x11-t10/
