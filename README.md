# Portofolio — Novarista Rokhma Wahyuningtyas

Website portofolio satu halaman dengan React + Vite. Tema terang, tanpa library UI
tambahan, dan bisa diekspor jadi PDF langsung dari browser.

## Menjalankan di komputer

Butuh Node.js 18 ke atas.

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk versi siap unggah:

```bash
npm run build     # hasil ada di folder dist/
npm run preview   # mengecek hasil build
```

## Struktur berkas

```
public/foto.jpg      pas foto (ganti dengan file baru, nama tetap foto.jpg)
src/data.js          SEMUA ISI TULISAN ada di sini
src/App.jsx          susunan halaman, animasi, dan tombol Ekspor PDF
src/styles.css       warna, tipografi, layout, animasi
```

## Mengubah isi

Cukup edit `src/data.js`. Tidak perlu menyentuh berkas lain.

- Nomor WhatsApp: ubah `telepon` (tampilan) dan `teleponIntl` (format 62…, tanpa
  tanda `+` dan tanpa `0` di depan).
- Email: ubah `email`. Subjek email otomatis diisi dari `subjekEmail`.
- Pesan pembuka WhatsApp: ubah `pesanWa`.
- Menambah pengalaman: tambahkan objek baru pada array `lapangan` atau `organisasi`.

## Ekspor PDF

Tombol **Ekspor PDF** di kanan atas memotret seluruh halaman, menyembunyikan
navigasi dan tombol, lalu menyimpannya sebagai A4.

Library `html2pdf.js` diambil dari CDN saat tombol pertama kali ditekan, jadi
komputer perlu terhubung internet. Kalau ingin bekerja offline, pasang lokal:

```bash
npm install html2pdf.js
```

lalu di `src/App.jsx` ganti pemanggilan `muatHtml2pdf()` dengan impor biasa:

```js
import html2pdf from "html2pdf.js";
```

dan hapus fungsi `muatHtml2pdf` beserta `pasangSkrip`.

Cara cadangan tanpa library: tekan `Ctrl + P` (`Cmd + P` di Mac) lalu pilih
**Save as PDF**. Sudah ada aturan cetak khusus di `styles.css`.

## Mengunggah ke internet (gratis)

1. Jalankan `npm run build`.
2. Buka [netlify.com/drop](https://app.netlify.com/drop) atau
   [vercel.com](https://vercel.com).
3. Seret folder `dist` ke halaman tersebut.

## Catatan teknis

- Animasi memakai `IntersectionObserver` — muncul saat elemen masuk layar.
- Pengaturan `prefers-reduced-motion` dihormati: animasi mati untuk pengguna yang
  mematikannya di sistem.
- Font diambil dari Google Fonts: Bricolage Grotesque, Public Sans, IBM Plex Mono.
