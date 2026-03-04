# Team Demo Setup

This guide helps each team member run the project locally for demo.

## 1. Requirements
- Node.js 18+ (Node.js 20 recommended)
- npm
- Git

Check versions:
```bash
node -v
npm -v
git --version
```

## 2. Clone project
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd RestAPIdemo
```

## 3. Install and run
```bash
npm install
copy .env.example .env
npm run reset-db
npm start
```

Open:
- `http://localhost:3000/` (Frontend dashboard)
- API base: `http://localhost:3000/api/v1`

## 4. Demo accounts
- Admin:
  - email: `admin@library.local`
  - password: `admin123`
- User:
  - email: `user1@example.com`
  - password: `123456`

## 5. Quick demo flow (3-5 mins)
1. Login as admin and create 1 new book.
2. Logout and login as user.
3. Borrow a book and then return it.
4. Search external books with title `harry potter`.

## 6. Common issues
1. Port 3000 already in use:
   - Stop existing process on 3000, then run `npm start` again.
2. Missing dependencies:
   - Re-run `npm install`.
3. External search returns 502:
   - This is expected in blocked-network environments.

## 7. Team workflow
1. Pull latest code before demo:
```bash
git pull
```
2. If DB looks inconsistent:
```bash
npm run reset-db
```

## 8. Optional: smoke test
```bash
npm run smoke-test
```
