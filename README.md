# SpinYuk - Collaborative Decision Spinner

SpinYuk adalah aplikasi multiplatform untuk membantu pengambilan keputusan kolaboratif melalui spinner digital interaktif. Fokus implementasi saat ini ada di platform web menggunakan Next.js, Tailwind CSS, PWA, drag and drop, dan struktur integrasi API.

## Platform

- Web Application: Next.js
- Desktop Application: Electron
- Backend API: Node.js, Express.js, Socket.io, JWT
- Database: SQLite

## Fitur Web Saat Ini

- Landing page modern
- Register dan login UI
- Struktur Google OAuth
- Dashboard spinner responsive
- Create room
- Join room
- Delete room lokal
- Shareable room link `/room/[code]`
- Spinner item CRUD
- Drag and drop reorder item
- Weighted random spinner
- History hasil spinner per room
- PWA manifest dan service worker production
- Offline page
- Struktur Axios API client untuk backend

## Setup Web

```bash
cd web
npm install
npm run dev
```

Web berjalan di `http://localhost:3000`.

## Environment Web

Salin `web/.env.example` menjadi `web/.env.local`, lalu isi nilai berikut saat backend dan Google OAuth sudah tersedia.

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

## Struktur Integrasi Backend

Endpoint helper tersedia di:

- `web/src/lib/api/client.ts`
- `web/src/lib/api/auth.ts`
- `web/src/lib/api/rooms.ts`

Struktur ini disiapkan untuk endpoint auth, room, spinner item, dan history. Saat backend sudah siap, logic dashboard bisa diarahkan dari local storage ke REST API dan Socket.io.
