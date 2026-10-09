# Prompt: Tingkatkan Maua Learn menjadi demo e-learning iPhone yang menonjol

Kamu adalah product designer sekaligus engineer senior untuk aplikasi Expo/React Native **Maua Learn** di repositori ini. Perbaiki aplikasi yang sudah ada; jangan memulai ulang atau membuang pekerjaan yang sudah berfungsi. Baca `AGENTS.md`, `README.md`, `DEMO.md`, dan kode terkait sebelum mengubah apa pun. Periksa perubahan lokal dan pertahankan pekerjaan pengguna yang belum di-commit.

## Konteks penugasan

Ini adalah tugas terbuka untuk menunjukkan kemampuan membangun aplikasi e-learning bagi organisasi yang bekerja secara global. Target pengalaman adalah iPhone dan kelak App Store. Reviewer mengutamakan UI/UX yang bersih, minimal, terasa alami di iPhone, dan terutama **cara pengguna menjalani proses belajar**. Aplikasi harus benar-benar bisa digunakan, tetapi seluruh konten kurikulum tidak harus lengkap. Submission sebelumnya dinilai belum ada yang menonjol.

Versi saat ini sudah memiliki satu lesson utama, keputusan dengan umpan balik, latihan menulis, penyimpanan progres lokal, dan empat lesson tambahan. Jangan menganggap keberadaan fitur tersebut sebagai bukti bahwa pengalaman belajarnya sudah matang.

## Sasaran hasil

Dalam sesi pertama sekitar 5–8 menit, reviewer yang tidak diberi panduan harus bisa memahami untuk siapa aplikasi ini, memulai lesson, mengambil keputusan yang terasa bermakna, menerima umpan balik yang dapat dipakai, mencoba memperbaiki jawabannya, menyelesaikan lesson, dan memahami keterampilan yang baru dipelajari. Hasilnya harus terasa seperti produk iPhone yang sengaja dirancang, bukan kumpulan kartu dan kuis.

## Prioritas 1 — Perdalam pengalaman lesson utama

- Audit perjalanan dari Today sampai completion. Hilangkan langkah yang hanya menambah ketukan tanpa meningkatkan pemahaman.
- Jadikan keputusan dalam lesson **memiliki konsekuensi yang terasa**. Respons setelah memilih harus merujuk pada pilihan pengguna dan mengubah setidaknya satu bagian lanjutan dari narasi, tantangan, atau refleksi. Jangan membuat percabangan semu yang hanya mengganti warna atau label “benar/salah”.
- Berikan cara yang jelas untuk meninjau langkah sebelumnya tanpa menghapus jawaban atau draf. Tentukan perilaku yang konsisten saat pengguna kembali, melanjutkan, keluar, dan membuka lagi lesson.
- Pertahankan umpan balik yang menjelaskan *mengapa* suatu pilihan bekerja atau gagal. Hindari memberi kesan bahwa masalah kerja global selalu memiliki satu jawaban mutlak jika konteksnya ambigu.
- Perbaiki transisi, hierarki informasi, keterbacaan, area sentuh, keyboard, dan posisi tombol utama pada layar iPhone kecil. Hormati pengaturan ukuran teks dan pembaca layar sejauh realistis untuk demo ini.

**Kriteria penerimaan:** Seorang penguji baru dapat menyelesaikan lesson tanpa bantuan; ia dapat kembali dan melanjutkan tanpa kehilangan pekerjaan; pilihannya memengaruhi pengalaman sesudahnya; setelah selesai ia dapat menjelaskan satu prinsip yang dipelajari dan bagaimana menerapkannya.

## Prioritas 2 — Buat Practice Lab jujur dan berguna

- Periksa `src/utils/practice-analyzer.ts`. Saat ini beberapa sinyal dapat dinyatakan terpenuhi hanya karena kata kunci, misalnya komitmen “I will” dianggap fallback atau nama zona waktu dianggap deadline. Perbaiki false positive yang paling jelas.
- Jangan tampilkan verdict yang menyiratkan pesan siap dikirim apabila pemeriksaan lokal belum bisa mendukung klaim itu. Gunakan bahasa yang transparan: apa yang terdeteksi, apa yang belum bisa diverifikasi, dan saran revisi yang spesifik.
- Pastikan pengguna bisa merevisi teks, membandingkan versi, dan melihat contoh rujukan tanpa kehilangan draf saat keluar atau membuka aplikasi kembali.
- Buat beberapa contoh pesan yang kuat, lemah, dan menipu aturan kata kunci. Verifikasi analyzer terhadap contoh tersebut dengan pengujian yang bermakna.

**Kriteria penerimaan:** Pesan yang hanya menjejalkan kata kunci tidak mendapat pujian berlebihan; umpan balik membantu pengguna memperbaiki pesannya; draf dan status latihan tetap masuk akal setelah resume.

## Prioritas 3 — Rapikan cakupan kurikulum dan identitas produk

- Perlakukan lesson utama sebagai demonstrasi kualitas. Empat lesson lain saat ini jauh lebih sederhana. Jangan menampilkan kuis singkat sebagai pengalaman setara dengan lesson utama. Pilih presentasi yang jujur: ringkas menjadi preview kurikulum, beri label yang jelas, atau tingkatkan hanya bagian yang benar-benar diperlukan untuk demo.
- Perjelas sasaran pengguna dan nilai untuk organisasi global dalam layar awal dan narasi pembelajaran. Konten contoh boleh tetap fiktif, tetapi jangan bergantung pada asumsi bahwa semua karyawan adalah engineer software. Jika identitas organisasi asli belum tersedia, gunakan identitas demo yang konsisten dan mudah diganti; jangan mengarang nama, logo, atau kebijakan organisasi.
- Pindahkan detail teknis seperti “Checklist Rules (Local)” dan kontrol reset prototipe dari pengalaman utama pengguna ke area demo/pengaturan yang sesuai. Reviewer tetap perlu tahu batasan prototipe melalui `DEMO.md`.
- Pertimbangkan pengalaman bahasa dan zona waktu untuk audiens global. Jangan mengklaim dukungan multibahasa jika belum diimplementasikan.

**Kriteria penerimaan:** Dalam 30 detik pertama, reviewer tahu aplikasi ini untuk siapa dan apa manfaat belajar yang ditawarkan. Jumlah lesson yang ditampilkan tidak menciptakan ekspektasi palsu tentang kelengkapan konten.

## Prioritas 4 — Buktikan kualitas iPhone dan kesiapan demo

- Uji alur utama di perangkat iPhone atau simulator iOS jika tersedia. Periksa safe area, ukuran layar kecil, keyboard, pengaturan ukuran teks lebih besar, VoiceOver/aksesibilitas dasar, dan kembali dari aplikasi yang ditutup. Jika perangkat/simulator tidak tersedia, nyatakan keterbatasan itu secara eksplisit; pemeriksaan web berukuran iPhone bukan pengganti uji native.
- Evaluasi splash buatan sendiri yang menahan layar sekitar dua detik. Singkatkan atau hapus bila tidak memberi nilai pada pengalaman pertama.
- Audit konfigurasi iOS dan EAS terhadap kebutuhan build demo/App Store, tetapi jangan mengklaim aplikasi sudah siap terbit sebelum build serta pemeriksaan distribusi benar-benar dilakukan. Jangan melakukan submit atau publikasi tanpa instruksi eksplisit.
- Perbarui `DEMO.md` menjadi walkthrough singkat yang memperlihatkan momen terkuat dalam 90 detik, dilanjutkan cara reviewer mencoba lesson sendiri dan daftar batasan prototipe yang jujur.

**Kriteria penerimaan:** Alur demo dapat diulang tanpa instruksi lisan tambahan, hasil pengujian native (atau keterbatasannya) terdokumentasi, dan klaim tentang kesiapan App Store sesuai bukti.

## Batasan teknis dan cara kerja

- Ini proyek Expo Router; ikuti struktur `src/app/` dan jangan menaruh komponen non-route di sana.
- Sebelum menyentuh API Expo/EAS/React Native, baca versi `expo` di `package.json`, dokumentasi versi yang cocok di `https://docs.expo.dev/versions/v<major>.0.0/`, serta `https://docs.expo.dev/llms.txt` dan halaman spesifik yang relevan.
- Jika perlu dependency baru, gunakan `npx expo install` (atau `bunx expo install` jika kelak ada `bun.lock`). Hindari dependency untuk perubahan yang bisa dikerjakan dengan yang sudah ada.
- Pertahankan performa mobile, kompatibilitas lintas platform, dan penyimpanan progres yang sudah berjalan. Jangan mengedit direktori native hasil generate secara manual.
- Jalankan `npx expo lint` dan `npx tsc --noEmit` sebelum menyatakan pekerjaan selesai. Tambahkan pengujian hanya untuk risiko perilaku yang penting, terutama analyzer, percabangan lesson, dan resume.

## Hasil yang harus diserahkan

1. Perubahan aplikasi yang dapat dijalankan, bukan hanya rekomendasi desain.
2. Ringkasan singkat tentang perubahan pengalaman belajar dan alasan tiap keputusan penting.
3. Bukti verifikasi: hasil lint/typecheck, pengujian perilaku yang relevan, serta perangkat atau simulator yang dipakai.
4. Batasan yang masih ada dan keputusan produk yang membutuhkan informasi nyata dari organisasi.

Prioritaskan kualitas satu perjalanan belajar sampai tuntas. Jangan memperbanyak layar, animasi, atau konten hanya agar submission terlihat lebih besar.
