import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// Ganti import ini
import { GoogleGenerativeAI } from '@google/generative-ai';

// App setup
const app = express();
const port = process.env.PORT || 3000; // Siapkan port

// Inisialisasi GoogleGenerativeAI dengan API Key
// Pastikan ada file .env dengan isi: GEMINI_API_KEY=kunci_api_anda
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
// Gunakan express.json() untuk membaca body berformat JSON, bukan multer
app.use(express.json());

// Endpoint untuk chat
app.post('/chat', async (req, res) => {
    // Ambil prompt langsung dari req.body
    const { prompt } = req.body;

    // Guard clause untuk cek apakah ada prompt
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({
            message: 'Request body harus berisi "prompt" dengan tipe data string.',
            data: null,
            success: false
        });
    }

    // "Daging"-nya: interaksi dengan Gemini
   // "Daging"-nya: interaksi dengan Gemini
try {
    // Pilih model yang akan digunakan
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL_NAME });
    const systemInstruction = `Kamu adalah 'Kakak Karir', sebuah chatbot AI yang dirancang khusus untuk membantu para fresh graduate dalam mencari kerja. ATURAN DAN GAYA BAHASAMU: - Persona: Kamu adalah seorang kakak tingkat yang ramah, suportif, antusias, dan berpengetahuan luas tentang dunia kerja awal. - Sapaan: Gunakan sapaan seperti "kamu" atau "sobat". Panggil dirimu "aku". - Gaya Bahasa: Gunakan bahasa Indonesia yang semi-formal. Artinya, bahasanya tetap positif dan profesional, tapi santai, mudah dimengerti, dan tidak kaku seperti robot korporat. Hindari bahasa yang terlalu formal. - Emoji: Gunakan emoji yang relevan dan positif (seperti ✨, 🚀, 👍, ✅) secara wajar untuk memberi semangat dan membuat suasana lebih bersahabat. - Struktur Jawaban: Berikan jawaban yang terstruktur, jelas, dan actionable (bisa langsung dipraktikkan). - Misi Utama: Selalu berikan semangat dan buat pengguna merasa lebih percaya diri di akhir setiap jawaban.`;
    const finalPrompt = `${systemInstruction}\n\nPertanyaan dari user: ${prompt}`;
    const result = await model.generateContent(finalPrompt); // <--- UBAH 'prompt' menjadi 'finalPrompt'
    const response = result.response;
    const text = response.text();

    // Kirim response dari Gemini ke client
    res.status(200).json({
        message: 'Berhasil mendapatkan response dari Gemini',
        data: text,
        success: true
    });
} catch (error) {
    // ... (blok catch tidak perlu diubah)catch (error) {
        console.error("Error dari Gemini API:", error);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server saat menghubungi Gemini API',
            data: null,
            success: false
        });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
