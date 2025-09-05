# iStore — Full-Stack iTunes Search (React + Express + MongoDB)

Hi! This is my capstone project: a full-stack app where you can search the iTunes Store / Apple Books, log in, and save favourites. I built a secure backend with JWT auth and a clean, responsive React frontend.

---

## ✨ Features

- 🔎 Search iTunes by term + category (music, movie, podcast, tvShow, etc.)
- ⭐ Add / remove favourites (per user) stored in MongoDB
- 🔐 Auth: register, login, logout, `/me`, short-lived access token + refresh cookie
- 💅 Polished, responsive UI (Bootstrap + custom styles)
- 🧱 Clear separation of concerns (client + server)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+  
- MongoDB (local) **or** MongoDB Atlas (free tier)
- npm

### 1) Install
```bash
# from repo root
cd server && npm i
cd ../client && npm i
```

### 2) Environment variables

**`server/.env`**
```
PORT=5000
ALLOWED_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/istore

# JWT
JWT_ACCESS_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

# iTunes base URL (default OK)
ITUNES_BASE_URL=https://itunes.apple.com
```

**`client/.env`**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3) Run the backend (with auto-reload)
```bash
cd server
npm run dev     # nodemon (or: npm start to run once)
```
Verify in your browser: `http://localhost:5000/api/health` → `{"ok":true}`

### 4) Run the frontend
```bash
cd ../client
npm run dev
```
Open `http://localhost:5173`

---

## 🧪 How I test locally

1. **Register** (or Login).  
2. Go to **Dashboard** → search for e.g. “Beatles”, category “Music”.  
3. Add some items to **Favourites** (check the favourites dropdown).  
4. Refresh the page → the navbar greets me by name (`/auth/me` rehydrates).  
5. Logout → navbar switches to Login/Register.

---

## 🔌 API Overview (server)

Base URL (dev): `http://localhost:5000/api`

### Auth
- `POST /auth/register` → `{ name, email, password }`  
  Returns `{ accessToken, user }` and sets `refresh_token` (HttpOnly cookie).
- `POST /auth/login` → `{ email, password }`  
  Returns `{ accessToken, user }` and sets `refresh_token` cookie.
- `POST /auth/logout` → clears refresh cookie *(auth required)*.
- `POST /auth/refresh` → rotate access token using refresh cookie.
- `GET /auth/me` → returns `{ user }` *(auth required)*.

### Search *(auth required)*
- `GET /search?term=<string>&media=<key>&limit=24`  
  `media` one of: `all`, `music`, `movie`, `podcast`, `audiobook`, `shortFilm`, `tvShow`, `software`, `ebook`.
  
---

## 🔐 Auth Model

- On login/register, I return an **access token** (JWT, short-lived) and set a **refresh token** in an **HttpOnly** cookie.
- The frontend stores `accessToken` in memory/localStorage; Axios adds `Authorization: Bearer <token>` to protected requests.
- Protected routes (`/auth/me`, `/search`, `/favourites/*`) use middleware to verify the access token.
- **Production note**: for cross-origin refresh cookies, use `sameSite: 'none'` and `secure: true`. In dev: `sameSite: 'lax'`, `secure: false`.

---

## 🖥️ Frontend Notes

- Built with **Vite + React + Bootstrap** and a small **AuthProvider**.
- Navbar updates: unauth → Login/Register; auth → “Welcome back, {name}” + Logout.
- Dashboard includes:
  - **Search** form with category dropdown
  - Results grid with **Add to favourites**
  - **Favourites dropdown** (view/remove)

---

## 🛠️ Troubleshooting

- **CORS with credentials**: server must send a specific origin (not `*`) and `credentials: true`.  
  Set `ALLOWED_ORIGIN=http://localhost:5173`.

- **JWT signing error** (`secretOrPrivateKey must have a value`): ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set and `.env` loads before token code.

- **Missing Authorization header**: protected routes expect `Authorization: Bearer <accessToken>`. The axios interceptor attaches it after login/register.

- **Empty search results**: use official iTunes media keys (`shortFilm`, `tvShow`, etc.) and confirm the server receives `term` via `req.query`.

---

## 📦 Build & Deploy

### Build
```bash
# frontend
cd client && npm run build     # outputs /dist

# backend
cd ../server && npm start
```

### Render (free tier)
- **Frontend** → Static Site from `client/`, build with `npm ci && npm run build`, publish `dist/`.
- **Backend** → Web Service from `server/`, build `npm ci`, start `node server.js`.  
  Set envs: `NODE_ENV=production`, `ALLOWED_ORIGIN=<frontend URL>`, JWT secrets, `MONGODB_URI`, etc.

---

## 🧰 Tech Stack

- **Frontend:** React (Vite), Axios, Bootstrap  
- **Backend:** Node.js, Express (ESM), Mongoose  
- **Auth:** JWT (access + refresh cookie), bcrypt  
- **External API:** iTunes Search API  
- **DB:** MongoDB / Atlas

---

## 📎 License

This project is for learning/demo purposes. Feel free to fork and iterate.
