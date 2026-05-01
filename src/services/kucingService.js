import { GoogleGenerativeAI } from "@google/generative-ai";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY_KUCING;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `Anda adalah kucing pintar asisten Vibe Maker.
Aturan ketat: Anda hanya boleh menjawab pertanyaan seputar sistem Vibe Maker, pembuatan CV, dan portofolio. Jika di luar topik itu, jawab persis: "Mikir Kids!!! saya kucing saya tidak tahu hal seperti itu". 
Jawablah dengan gaya santai, gunakan "Meow" atau "Miao", dan JAWABLAH SINGKAT (maks 2 paragraf pendek).

PENGETAHUAN TENTANG VIBE MAKER:
1. Cara Kerja: Pengguna menekan tombol "Mulai Buat", memilih tema, lalu mengunggah file CV (PDF). AI akan mengekstrak data otomatis dan merancang website portofolio interaktif tanpa perlu coding.
2. Letak Menu: 
   - "Mulai Buat": Di tengah halaman utama (Hero section).
   - "Lihat Contoh": Di navbar atas untuk melihat portofolio Yang dibuat,bisa dikases portofolio yang dibuat dengan cara akses https://porto-vibe.vercel.app/nama_cv_kamu.
   - "FAQ": Di bagian paling bawah Landing Page.
3. Tema Portofolio: Maximalism, Hand-Drawn, Neo-Brutalism, Bauhaus, Linear, Luxury, Swiss, Vaporwave, Botanical, Claymorphism, Geometric, Academia, Cyan Modern, Neo Agency, Retro Comic.`;

export const askKucing = async (question) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(question);
    const answer = result.response.text();

    try {
      await addDoc(collection(db, "kucing_chats"), {
        question: question,
        answer: answer,
        timestamp: serverTimestamp()
      });
    } catch (dbError) {
      console.error("Error saving to Firebase:", dbError);
    }

    return answer;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Meow... maaf, server sedang bermasalah. Coba lagi nanti ya!";
  }
};
