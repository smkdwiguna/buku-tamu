# Aplikasi Buku Tamu Sekolah Berbasis Web

> **Proyek Ujian Kompetensi 2022**  
> Aplikasi web modern untuk mengelola kunjungan tamu di lingkungan sekolah dengan fitur pengambilan foto menggunakan webcam.

![Next.js](https://img.shields.io/badge/Next.js-16.0.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?style=flat-square&logo=prisma)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?style=flat-square&logo=bootstrap)

## 📋 Deskripsi

Aplikasi Buku Tamu Sekolah adalah sistem informasi berbasis web yang dirancang untuk mencatat dan mengelola data kunjungan tamu di sekolah. Aplikasi ini dilengkapi dengan fitur pengambilan foto tamu secara real-time menggunakan webcam, manajemen data tamu, departemen, dan running text untuk pengumuman.

## ✨ Fitur Utama

- 🔐 **Autentikasi & Otorisasi** - Login/logout dengan session berbasis cookie
- 👥 **Manajemen Data Tamu** - CRUD lengkap untuk data kunjungan tamu
- 📸 **Pengambilan Foto Webcam** - Capture foto tamu secara real-time
- 🏢 **Manajemen Departemen** - Kelola unit/bagian di sekolah
- 📢 **Running Text** - Tampilan teks berjalan untuk pengumuman
- 📊 **Dashboard Statistik** - Overview jumlah tamu (total, hari ini, aktif)
- ✅ **Check-in/Check-out** - Pencatatan waktu kedatangan dan kepulangan tamu
- 📱 **Responsive Design** - Tampilan optimal di berbagai ukuran layar

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Next.js 16.0.6** - React framework dengan App Router
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5.3.8** - CSS framework untuk styling
- **React Webcam** - Library untuk akses webcam
- **Bootstrap Icons** - Icon library

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Prisma ORM 6.19.0** - Database ORM
- **SQLite** - Database (development)
- **Better SQLite3** - SQLite driver untuk Node.js

### Development Tools
- **ESLint** - Linting
- **TypeScript** - Type checking
- **npm** - Package manager

## 📋 Prasyarat

Sebelum menginstal aplikasi, pastikan sistem Anda memiliki:

- **Node.js** versi 18.x atau lebih baru
- **npm** atau **yarn** (package manager)
- **Git** (untuk cloning repository)
- **Browser modern** dengan dukungan webcam (Chrome, Firefox, Edge, Safari)

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/smkdwiguna/buku-tamu.git
cd guestbook-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Buat file `.env` di root directory:

```bash
touch .env
```

Isi file `.env` dengan:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Generate Prisma Client & Migrasi Database

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi database
npx prisma migrate dev --name init

# Seed database dengan data awal (admin & departemen)
npx tsx prisma/seed.ts
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 👤 Kredensial Default

Setelah seeding, gunakan kredensial berikut untuk login:

- **Username**: `admin`
- **Password**: `password123`

> ⚠️ **Penting**: Segera ubah password default setelah login pertama kali di lingkungan production!

## 🔧 Perintah yang Tersedia

```bash
# Development
npm run dev          # Jalankan development server

# Production
npm run build        # Build untuk production
npm start            # Jalankan production server

# Database
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev # Jalankan migrasi (development)
npx prisma migrate deploy # Jalankan migrasi (production)
npx prisma studio    # Buka Prisma Studio (GUI database)
npx tsx prisma/seed.ts # Seed database

# Linting
npm run lint         # Jalankan ESLint
```

## 🔒 Keamanan

- ✅ Password disimpan dalam hash bcrypt
- ✅ Session berbasis HTTP-only cookies
- ✅ CSRF protection (bawaan Next.js)
- ✅ SQL Injection protection (Prisma ORM)
