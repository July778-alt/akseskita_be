# AksesKita Backend (REST API)

[![Node.js](https://img.shields.io/badge/Node.js-18+-68a063?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Secure_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![PM2](https://img.shields.io/badge/PM2-Cluster_Ready-2B037A?style=for-the-badge&logo=pm2&logoColor=white)](https://pm2.keymetrics.io/)

Backend RESTful API untuk **AksesKita** — platform pelaporan fasilitas publik dan infrastruktur ramah disabilitas/aksesibilitas kota (seperti guiding block/tactile paving rusak, trotoar tidak layak, jalan berlubang, lampu penyeberangan mati, ramp kursi roda, dan fasilitas publik lainnya).

Backend ini melayani permintaan klien dari **AksesKita Web** (Next.js) dan **AksesKita Mobile** (React Native / Expo).

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi dan Dependensi](#teknologi-dan-dependensi)
- [Arsitektur dan Struktur Direktori](#arsitektur-dan-struktur-direktori)
- [Alur Status Laporan (Report Workflow)](#alur-status-laporan-report-workflow)
- [Peran Pengguna (Role dan Permissions)](#peran-pengguna-role-dan-permissions)
- [Panduan Instalasi dan Menjalankan](#panduan-instalasi-dan-menjalankan)
- [Variabel Lingkungan (.env)](#variabel-lingkungan-env)
- [Akun Bawaan (Seed Data)](#akun-bawaan-seed-data)
- [Dokumentasi Endpoint API](#dokumentasi-endpoint-api)
- [Format Respon Standar](#format-respon-standar)
- [Deployment dan Production (PM2)](#deployment-dan-production-pm2)
- [Lisensi](#lisensi)

---

## Fitur Utama

- **Autentikasi dan RBAC (Role-Based Access Control)**:
  - Autentikasi berbasis JWT (JSON Web Token) dengan hashing kata sandi menggunakan `bcrypt`.
  - Kontrol akses bertingkat: `user` (pelapor publik), `admin` (petugas/verifikator), dan `super_admin`.
- **Pelaporan Infrastruktur Berbasis Geospasial**:
  - Pelaporan detail dengan judul, deskripsi, kategori, koordinat latitude dan longitude, alamat fisik, dan foto bukti lapangan.
  - Unggah berkas gambar menggunakan `multer` (format JPG, JPEG, PNG, WEBP).
- **Pelacakan Status dan Audit Trail**:
  - Alur status tiket laporan (`pending` -> `verified` -> `in_progress` -> `resolved` / `rejected`).
  - Riwayat perubahan status tercatat di tabel `report_histories` lengkap dengan aktor pengubah dan stempel waktu.
- **Komentar dan Diskusi Terbuka**:
  - Pelapor dan pihak admin/petugas dapat bertukar informasi dan kabar terbaru pada setiap tiket laporan.
- **Notifikasi Otomatis Berbasis Event (In-App Notifications)**:
  - Memanfaatkan arsitektur `EventEmitter` terpadu: Pelapor otomatis menerima notifikasi in-app ketika status laporan berubah atau terdapat komentar baru.
- **Statistik dan Metrik Dashboard**:
  - Agregasi data langsung dari PostgreSQL: total laporan, jumlah per status, kategori yang paling sering dilaporkan, tren laporan per bulan, dan total pengguna.
- **Keamanan dan Kestabilan**:
  - Validasi skema permintaan ketat menggunakan `zod` di tingkat middleware.
  - Proteksi header menggunakan `helmet`, penanganan CORS fleksibel untuk web dan mobile.
  - Pembatasan tingkat permintaan dengan `express-rate-limit` (1.000 req/15 menit).
  - Health check endpoint (`/health`) untuk memantau ketersediaan koneksi database dan uptime server.
  - Logging terstruktur dengan `morgan` dan custom logger stream.

---

## Teknologi dan Dependensi

| Kategori                     | Teknologi                                                                                                            | Deskripsi                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Runtime & Language** | [Node.js](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/)                                         | Eksekusi modern berbasis ESM dengan runtime`tsx`                                        |
| **Framework**          | [Express 5](https://expressjs.com/)                                                                                   | Web framework performa tinggi generasi terbaru                                            |
| **Database**           | [PostgreSQL](https://www.postgresql.org/) & [`pg`](https://node-postgres.com/)                                       | Relational database tanpa ORM; menggunakan native Connection Pool & parameterized queries |
| **Validasi**           | [Zod](https://zod.dev/)                                                                                               | Skema validasi runtime type-safe untuk body, query, dan params                            |
| **Autentikasi**        | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) & [bcrypt](https://github.com/kelektiv/node.bcrypt.js)      | Enkripsi kata sandi dan manajemen bearer token JWT                                        |
| **Upload Media**       | [Multer](https://github.com/expressjs/multer)                                                                         | Pemrosesan upload berkas multipart/form-data ke disk                                      |
| **Keamanan**           | [Helmet](https://helmetjs.github.io/) & [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | Proteksi HTTP headers & mitigasi brute-force/DoS                                          |
| **Process Manager**    | [PM2](https://pm2.keymetrics.io/)                                                                                     | Cluster mode runner dan auto-restart di production                                        |

---

## Arsitektur dan Struktur Direktori

Proyek ini menerapkan arsitektur modular berbasis fitur (*Feature-based Modular Architecture*), di mana setiap modul mengelola rute, controller, service, repository SQL, dan skema validasi Zod miliknya sendiri:

```text
akseskita_be/
├── src/
│   ├── config/              # Konfigurasi aplikasi (database, env Zod, logger, multer, rate-limit)
│   ├── database/            # Setup pool pg, migrasi skema, dan data seeder
│   │   ├── migrations/      # File SQL mentah berurutan (001 s/d 006)
│   │   └── seeds/           # Data dummy/inisial (users, categories, reports, comments)
│   ├── middlewares/         # Middleware global (auth, role, validate Zod, error-handler, 404)
│   ├── modules/             # Modul fungsional per domain
│   │   ├── auth/            # Registrasi & login
│   │   ├── categories/      # Manajemen kategori laporan
│   │   ├── comments/        # Diskusi dan tanggapan laporan
│   │   ├── dashboard/       # Agregasi data statistik untuk admin
│   │   ├── notifications/   # In-app notifications & listeners EventEmitter
│   │   ├── report-histories/# Log histori perubahan status
│   │   ├── reports/         # Tiket laporan publik, upload foto, & filter
│   │   └── users/           # Profil pengguna & manajemen hak akses
│   ├── routes/              # Central aggregator router Express
│   ├── shared/              # Utilitas bersama (asyncHandler, response helper, hash, JWT, pagination, events)
│   ├── types/               # Deklarasi tipe TypeScript global (termasuk express user)
│   ├── app.ts               # Inisialisasi Express app & middleware stack
│   └── server.ts            # Entry point server & inisialisasi event notification listeners
├── uploads/                 # Folder penyimpanan media lokal (laporan & foto profil)
├── deploy.sh                # Skrip bash otomatisasi deployment server
├── ecosystem.config.cjs     # Konfigurasi cluster PM2 di server produksi
├── package.json             # Dependensi & skrip proyek
├── tsconfig.json            # Konfigurasi TypeScript compiler
└── .env.example             # Template variabel lingkungan
```

---

## Alur Status Laporan (Report Workflow)

Setiap laporan yang dikirimkan oleh pengguna akan melalui siklus hidup status sebagai berikut:

```mermaid
stateDiagram-v2
    [*] --> pending: Laporan Dikirim (User)
    pending --> verified: Diverifikasi (Admin/Superadmin)
    pending --> rejected: Ditolak / Tidak Valid (Admin/Superadmin)
    verified --> in_progress: Mulai Dikerjakan / Ditindaklanjuti
    in_progress --> resolved: Masalah Selesai Diperbaiki
    rejected --> [*]
    resolved --> [*]
```

> **Catatan:** Setiap perubahan status dari satu tahap ke tahap lain akan otomatis tercatat ke dalam tabel `report_histories` dan memicu notifikasi kepada pemilik laporan.

---

## Peran Pengguna (Role dan Permissions)

| Fitur / Hak Akses                  |   User (Masyarakat)   | Admin (Petugas) | Super Admin |
| ---------------------------------- | :--------------------: | :-------------: | :---------: |
| Registrasi & Login                 |           Ya           |       Ya       |     Ya     |
| Membuat Laporan & Unggah Foto      |           Ya           |       Ya       |     Ya     |
| Melihat Laporan Pribadi            |           Ya           |       Ya       |     Ya     |
| Melihat Seluruh Laporan Publik     | Ya (Hanya data publik) |       Ya       |     Ya     |
| Memberi Komentar pada Laporan      |           Ya           |       Ya       |     Ya     |
| Menghapus Komentar Sendiri         |           Ya           |       Ya       |     Ya     |
| Memperbarui Status Laporan         |         Tidak         |       Ya       |     Ya     |
| Menghapus Laporan Apapun           |         Tidak         |       Ya       |     Ya     |
| Mengelola Kategori (CRUD)          |         Tidak         |       Ya       |     Ya     |
| Mengakses Statistik Dashboard      |         Tidak         |       Ya       |     Ya     |
| Mengelola Pengguna & Mengubah Role |         Tidak         |      Tidak      |     Ya     |

---

## Panduan Instalasi dan Menjalankan

### 1. Prasyarat Sistem

- **Node.js**: Versi `18.x` atau lebih baru
- **PostgreSQL**: Versi `14.x` atau lebih baru
- **Git**

### 2. Kloning Repositori

```bash
git clone https://github.com/July778-alt/akseskita_be.git
cd akseskita_be
```

### 3. Pasang Dependensi

```bash
npm install
```

### 4. Konfigurasi Database PostgreSQL

Buka terminal PostgreSQL (psql) atau GUI (pgAdmin / DBeaver), lalu buat database baru:

```sql
CREATE DATABASE akses_kita;
```

### 5. Salin dan Sesuaikan .env

Salin template berkas `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Sesuaikan konfigurasi kredensial database PostgreSQL dan JWT secret Anda.

### 6. Jalankan Migrasi Skema Database

Perintah ini akan mengeksekusi berkas migrasi SQL secara berurutan:

```bash
npm run migrate
```

### 7. Jalankan Data Awal (Seeding Data)

*(Disarankan untuk lingkungan development/pengujian)*:

```bash
npm run seed
```

### 8. Jalankan Server Development

```bash
npm run dev
```

Server akan aktif di: **`http://localhost:5000`** (atau port sesuai konfigurasi `.env`).

---

## Variabel Lingkungan (.env)

Berikut adalah daftar variabel lingkungan yang divalidasi oleh `Zod` di `src/config/env.ts`:

| Variabel           | Tipe Data | Nilai Default             | Keterangan                                                           |
| ------------------ | --------- | ------------------------- | -------------------------------------------------------------------- |
| `PORT`           | Number    | `5000`                  | Port listening server HTTP                                           |
| `NODE_ENV`       | Enum      | `development`           | Lingkungan aplikasi (`development`, `production`, `test`)      |
| `SERVER_URL`     | URL       | `http://localhost:5000` | URL publik backend (digunakan untuk resolusi path media)             |
| `CLIENT_URL`     | URL       | **Wajib diisi**     | URL aplikasi frontend (Next.js / Expo) untuk kebijakan CORS          |
| `DATABASE_URL`   | String    | **Wajib diisi**     | URI koneksi PostgreSQL (`postgresql://user:pass@host:5432/dbname`) |
| `JWT_SECRET`     | String    | **Wajib diisi**     | Kunci rahasia untuk menandatangani token JWT                         |
| `JWT_EXPIRES_IN` | String    | `1d`                    | Masa berlaku token JWT (misal:`1d`, `7d`, `24h`)               |

---

## Akun Bawaan (Seed Data)

Setelah menjalankan `npm run seed`, Anda dapat langsung masuk menggunakan akun default berikut:

| Peran (Role)                | Email                   | Password     | Kegunaan                                                                 |
| --------------------------- | ----------------------- | ------------ | ------------------------------------------------------------------------ |
| **Super Admin**       | `admin@akseskita.com` | `admin123` | Akses penuh dashboard, manajemen role user, kategori, dan status laporan |
| **User (Masyarakat)** | `radit@gmail.com`     | `admin123` | Akun publik untuk menguji alur pembuatan laporan dan komentar            |

---

## Dokumentasi Endpoint API

Base URL API: **`http://localhost:5000/api`**

Semua endpoint yang bertanda `[Auth]` membutuhkan header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### 1. Health Check

| Method  | Endpoint    | Akses  | Deskripsi                                                          |
| ------- | ----------- | ------ | ------------------------------------------------------------------ |
| `GET` | `/health` | Publik | Memeriksa ketersediaan koneksi database PostgreSQL & uptime server |

---

### 2. Autentikasi (/api/auth)

| Method   | Endpoint               | Akses  | Body Request / Keterangan                                        |
| -------- | ---------------------- | ------ | ---------------------------------------------------------------- |
| `POST` | `/api/auth/register` | Publik | `{ full_name, email, password }`                               |
| `POST` | `/api/auth/login`    | Publik | `{ email, password }` -> Mengembalikan token JWT & profil user |

---

### 3. Pengguna (/api/users)

| Method     | Endpoint                | Akses              | Deskripsi                                                                            |
| ---------- | ----------------------- | ------------------ | ------------------------------------------------------------------------------------ |
| `GET`    | `/api/users/me`       | Auth               | Mengambil detail profil pengguna saat ini                                            |
| `PUT`    | `/api/users/me`       | Auth               | Update nama (`full_name`) dan foto profil (`multipart: avatar`)                  |
| `GET`    | `/api/users`          | Admin, Super Admin | Mengambil daftar pengguna (dukungan query:`page`, `limit`, `search`, `role`) |
| `DELETE` | `/api/users/:id`      | Admin, Super Admin | Menghapus akun pengguna berdasarkan UUID                                             |
| `PATCH`  | `/api/users/:id/role` | Super Admin        | Mengubah peran pengguna (`role`: `user` \| `admin` \| `super_admin`)         |

---

### 4. Kategori Laporan (/api/categories)

| Method     | Endpoint                | Akses              | Deskripsi                                      |
| ---------- | ----------------------- | ------------------ | ---------------------------------------------- |
| `GET`    | `/api/categories`     | Publik             | Mengambil semua kategori laporan yang tersedia |
| `POST`   | `/api/categories`     | Admin, Super Admin | Membuat kategori baru (`{ name }`)           |
| `PUT`    | `/api/categories/:id` | Admin, Super Admin | Memperbarui nama kategori                      |
| `DELETE` | `/api/categories/:id` | Admin, Super Admin | Menghapus kategori                             |

---

### 5. Laporan Aksesibilitas (/api/reports)

| Method     | Endpoint                       | Akses              | Deskripsi                                                                                                                                              |
| ---------- | ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET`    | `/api/reports`               | Publik / Auth      | Mengambil daftar laporan (dukungan query:`page`, `limit`, `status`, `category_id`, `search`, `sort`)                                       |
| `GET`    | `/api/reports/:id`           | Publik             | Mengambil detail laporan lengkap berdasarkan ID                                                                                                        |
| `POST`   | `/api/reports`               | Auth               | Membuat laporan baru (**multipart/form-data**: `title`, `description`, `category_id`, `latitude`, `longitude`, `address`, `image`) |
| `DELETE` | `/api/reports/:id`           | Auth               | Menghapus laporan (Hanya pemilik laporan atau Admin/Super Admin)                                                                                       |
| `PATCH`  | `/api/reports/:id/status`    | Admin, Super Admin | Mengubah status laporan (`status`: `pending` \| `verified` \| `in_progress` \| `resolved` \| `rejected`)                                   |
| `GET`    | `/api/reports/:id/histories` | Publik             | Melihat riwayat kronologis perubahan status tiket laporan                                                                                              |

---

### 6. Komentar & Tanggapan (/api)

| Method     | Endpoint                            | Akses         | Deskripsi                                             |
| ---------- | ----------------------------------- | ------------- | ----------------------------------------------------- |
| `GET`    | `/api/reports/:reportId/comments` | Publik / Auth | Mengambil seluruh komentar pada suatu tiket laporan   |
| `POST`   | `/api/reports/:reportId/comments` | Auth          | Mengirim komentar baru pada laporan (`{ message }`) |
| `DELETE` | `/api/comments/:id`               | Auth          | Menghapus komentar (Hanya pemilik komentar)           |

---

### 7. Notifikasi In-App (/api/notifications)

| Method     | Endpoint                             | Akses | Deskripsi                                           |
| ---------- | ------------------------------------ | ----- | --------------------------------------------------- |
| `GET`    | `/api/notifications`               | Auth  | Mengambil daftar notifikasi milik pengguna saat ini |
| `PATCH`  | `/api/notifications/mark-all-read` | Auth  | Menandai seluruh notifikasi telah dibaca            |
| `PATCH`  | `/api/notifications/:id/read`      | Auth  | Menandai satu notifikasi tertentu telah dibaca      |
| `DELETE` | `/api/notifications/clear-all`     | Auth  | Menghapus seluruh riwayat notifikasi pengguna       |
| `DELETE` | `/api/notifications/:id`           | Auth  | Menghapus satu notifikasi tertentu                  |

---

### 8. Dashboard Statistik (/api/dashboard)

| Method  | Endpoint           | Akses              | Deskripsi                                                                                                     |
| ------- | ------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `GET` | `/api/dashboard` | Admin, Super Admin | Mengambil metrik: total laporan, rincian status, kategori terpopuler, grafik tren bulanan, dan total pengguna |

---

## Format Respon Standar

Aplikasi menggunakan format JSON seragam untuk mempermudah integrasi frontend:

### Contoh Respon Sukses (200 / 201)

```json
{
  "success": true,
  "message": "Reports retrieved",
  "data": [
    {
      "id": "c1f7a224-...",
      "title": "Guiding Block Hancur di Depan Halte",
      "description": "Jalur pemandu tuna netra terputus dan rusak parah.",
      "status": "pending",
      "image_url": "uploads/reports/171123456789.jpg",
      "latitude": -6.200000,
      "longitude": 106.816666,
      "address": "Jl. Sudirman No. 10",
      "created_at": "2026-10-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

### Contoh Respon Gagal Validasi Zod (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

---

## Deployment dan Production (PM2)

Repositori ini sudah dilengkapi konfigurasi cluster PM2 di `ecosystem.config.cjs` serta skrip `deploy.sh`.

### Menjalankan dengan PM2:

```bash
# Menjalankan backend dalam mode cluster production
pm2 start ecosystem.config.cjs --env production

# Melihat log aplikasi
pm2 logs akseskita-backend

# Memantau performa CPU/RAM
pm2 monit
```

### Otomatisasi Deployment (Server Linux/VPS):

```bash
chmod +x deploy.sh
./deploy.sh
```

Skrip `deploy.sh` akan otomatis:

1. Menarik commit terbaru dari branch `main` (`git pull origin main`)
2. Memasang dependensi (`npm install`)
3. Menjalankan migrasi database (`npm run migrate`)
4. Memuat ulang instans PM2 tanpa downtime (`pm2 restart ecosystem.config.cjs --env production`)

---

## Lisensi

Proyek ini dikembangkan sebagai bagian dari inisiatif portofolio rekayasa perangkat lunak (RPL) dan platform kepedulian aksesibilitas publik AksesKita.
Didistribusikan di bawah lisensi [ISC](LICENSE).
