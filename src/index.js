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
    try {
        // Pilih model yang akan digunakan
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate konten berdasarkan prompt
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Kirim response dari Gemini ke client
        res.status(200).json({
            message: 'Berhasil mendapatkan response dari Gemini',
            data: text,
            success: true
        });
    } catch (error) {
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