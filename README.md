## Project Overview

Aplikasi ini adalah Job Recruitment Platform sederhana berbasis React, yang memungkinkan dua jenis user Admin dan Jobseeker untuk mengelola dan melamar pekerjaan.

- Admin dapat membuat, mengedit, dan menghapus lowongan pekerjaan.
- Jobseeker dapat melihat daftar pekerjaan yang tersedia dan melamar sesuai minat mereka.
Selain itu, sistem sudah dilengkapi dengan proteksi routing, autentikasi berbasis role, serta notifikasi menggunakan React Toastify untuk pengalaman pengguna yang lebih interaktif.

## Tech Stack Used

Frontend:
- React + Vite + Typescript.
- Tailwind CSS + Daisy UI: styling.
- React Router DOM : navigasi.
- HeroIcon + Lucide React : icon.
- ProtectedRoute & AuthRedirect Components : memastikan user hanya bisa mengakses halaman sesuai role/login status.
- React Toastify : untuk menampilkan notifikasi sukses/gagal di berbagai aksi (misalnya login, submit form, dsb).

Data & Storage:
- LocalStorage — menyimpan data user login dan simulasi data jobs/users.
- JSON file (db.json) — sebagai mock database untuk data awal pengguna dan pekerjaan.

## How to Run Locally

Clone repository
```
git clone https://github.com/nuruslaily/hiring-platform.git
cd hiring-platform
```

Install dependencies
``
npm install
``

Jalankan app
``
npm run dev
``

Buka di browser
``
http://localhost:5173
``