# PortoVibe 🚀

**PortoVibe** adalah platform pembuat portofolio berbasis AI yang dirancang untuk mengubah teks CV mentah (PDF) menjadi website portofolio yang interaktif, beranimasi, dan memiliki desain premium secara instan.

## ✨ Fitur Utama
- **AI-Powered Generation**: Menggunakan model Gemini AI tercanggih untuk menyusun layout dan kode React secara dinamis.
- **No-Code Solution**: Membantu orang awam membuat website profesional tanpa pengetahuan koding sedikit pun.
- **Architectural Fluidity**: AI secara otomatis menyesuaikan struktur grid dan pola interaksi berdasarkan sistem desain yang dipilih.
- **Multi-Theme Support**: Berbagai pilihan tema mulai dari *Maximalism*, *Neo-Brutalism*, *Glassmorphism*, hingga *Retro Comic*.
- **Dynamic Rendering**: Menggunakan transpiler di sisi klien untuk merender komponen React yang dibuat oleh AI secara real-time.

## 🛠️ Teknologi yang Digunakan
- **Frontend**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS (Modern Glassmorphism & Bento Grid)
- **Typography**: [Sora](https://fonts.google.com/specimen/Sora) (Headings) & [Inter](https://fonts.google.com/specimen/Inter) (Body)
- **AI Engine**: [Google Gemini AI API](https://ai.google.dev/)
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore & Storage)
- **Transpiler**: [@babel/standalone](https://babeljs.io/docs/en/babel-standalone)

---

## 🔑 Persiapan API Keys

Sebelum menjalankan proyek, Anda perlu mendapatkan API Key berikut:

### 1. Google Gemini AI
*   Buka [Google AI Studio](https://aistudio.google.com/).
*   Klik **"Get API Key"** dan buat kunci baru.
*   Simpan ke `VITE_GEMINI_API_KEY`.

### 2. Firebase Config
*   Buat proyek di [Firebase Console](https://console.firebase.google.com/).
*   Tambahkan aplikasi Web dan salin konfigurasi SDK-nya.
*   Masukkan nilainya ke variabel `VITE_FIREBASE_...` yang sesuai.

---

## 🚀 Cara Menjalankan di Lokal

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/username/portovibe-ai.git](https://github.com/username/portovibe-ai.git)
    cd portovibe-ai
    ```

2.  **Instalasi Dependency**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**
    Buat file `.env.local` di root folder dan isi dengan data berikut:
    ```env
    # FIREBASE CONFIGURATION
    VITE_FIREBASE_API_KEY=xxx
    VITE_FIREBASE_AUTH_DOMAIN=xxx
    VITE_FIREBASE_PROJECT_ID=xxx
    VITE_FIREBASE_STORAGE_BUCKET=xxx
    VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
    VITE_FIREBASE_APP_ID=xxx
    VITE_FIREBASE_MEASUREMENT_ID=xxx

    # AI API KEYS
    VITE_GEMINI_API_KEY=xxx
    ```

4.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    
## 🎯 Tujuan Proyek
Proyek ini dibuat untuk membantu para profesional, pengembang, dan desainer dalam membuat representasi digital dari pengalaman kerja mereka tanpa harus menulis kode manual, namun tetap mendapatkan hasil yang unik dan estetik.

## 📝 Lisensi & Penulis

Proyek ini dikembangkan dan dikelola sepenuhnya oleh:
**Moh Muslih Sahmat**

---
### ⚠️ Peringatan Hak Cipta (Disclaimer)
**Seluruh kode, desain, dan konsep PortoVibe AI adalah milik intelektual pengembang.** 
Dilarang keras menyalin, menduplikasi, atau mendistribusikan ulang proyek ini untuk tujuan komersial atau diklaim sebagai milik pribadi tanpa izin tertulis dari penulis. Mari hargai karya kreatif dan integritas akademik.

---
© 2026 PortoVibe - Elevate your portfolio with a professional vibe.
