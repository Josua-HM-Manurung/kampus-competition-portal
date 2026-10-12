# Campus Competition Hub

Portal informasi lomba kampus dengan fitur admin untuk menambah lomba baru, poster, PDF panduan, dan link pendaftaran.

## Fitur utama
- Halaman landing page yang menampilkan daftar lomba
- Pencarian lomba berdasarkan judul, organizer, kategori, dan lokasi
- Filter kategori dan status lomba
- Area admin dengan password sederhana untuk menambah lomba baru
- Upload poster image atau input URL poster
- Upload PDF lomba atau input URL PDF
- Link pendaftaran yang bisa dibuka langsung
- Data disimpan di browser menggunakan `localStorage`

## Password admin
Default password admin:
- `kampus123`

## Cara menjalankan
1. Buka file `index.html` di browser, atau
2. Jalankan server lokal dengan perintah berikut dari folder proyek:

```bash
python -m http.server 8000
```

Lalu buka:
- `http://localhost:8000`

## Struktur file
- `index.html` – layout utama
- `styles.css` – styling tampilan web
- `app.js` – logika aplikasi dan admin

## Catatan
Karena aplikasi ini dibuat tanpa backend, data lomba tersimpan di browser (`localStorage`). Jika browser dihapus data, semua data yang ditambahkan juga akan hilang.

Untuk versi lebih lanjut, project ini bisa dikembangkan ke backend seperti Node.js + Express + database MySQL/PostgreSQL.
