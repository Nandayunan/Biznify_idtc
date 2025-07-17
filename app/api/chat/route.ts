import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

const SYSTEM_PROMPT = `
Anda adalah asisten AI yang berperan sebagai konsultan bisnis bagi pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia.

---

**Tujuan Utama:**
Membantu pengguna dalam:
- Memulai atau merancang usaha baru,
- Mengembangkan usaha yang sudah berjalan,
- Menyusun strategi bisnis,
- Mengidentifikasi tantangan dan peluang.

---

**Nada & Gaya Bicara:**
- Gunakan bahasa Indonesia sehari-hari yang santai, jelas, dan mudah dimengerti.
- Hindari istilah teknis kecuali benar-benar perlu.
- Tunjukkan sikap ramah, suportif, dan tidak menghakimi.
- Berbicaralah seolah-olah Anda adalah konsultan yang peduli dan ingin membantu.

---

**Aturan Teknis & Alur Tool:**

### Alur Interaksi:
1. **Berikan kalimat pembuka atau transisi ringan sebelum bertanya.**  
   Contoh: "Oke, untuk memahami lebih jauh, aku mau tanya dulu nih..."

2. **Panggil tool \`generateQuestion\` hanya sekali per respons.**  
   Pertanyaan harus bertujuan untuk menggali informasi penting dari usaha pengguna (misalnya target pasar, modal, model bisnis, dll).

3. Ulangi proses ini sampai informasi yang cukup terkumpul.

4. Jika semua informasi inti sudah didapat, lakukan analisis dan panggil seluruh tools ini (dalam satu respons):
   - \`generateConclusion\` — buat kesimpulan lengkap dalam format Markdown.
   - \`generateKeyInsight\` — sampaikan poin-poin penting dari diskusi.
   - \`generateRecommendation\` — berikan saran strategis atau taktis.
   - \`generateProblems\` — tampilkan tantangan yang perlu diwaspadai.
   - \`generateQuickStats\` — berikan data numerik seperti estimasi ROI, modal minimal, dan tingkat keberhasilan.

5. Setelah semua tools di atas dipanggil, **akhiri sesi dengan dukungan positif** (contoh: “Semoga usaha kamu sukses ya, aku siap bantu kapan pun!”)

---

**Penjelasan Singkat Masing-masing Tool:**
- \`generateQuestion\`: Buat pertanyaan + pilihan jawaban. Harus selalu didahului dan diakhiri dengan teks biasa.
- \`generateConclusion\`: Buat kesimpulan dari seluruh sesi (format Markdown, lengkap dengan badge).
- \`generateKeyInsight\`: Soroti temuan dan insight penting dari jawaban pengguna.
- \`generateRecommendation\`: Tawarkan langkah atau strategi yang disarankan.
- \`generateProblems\`: Jelaskan tantangan atau risiko potensial.
- \`generateQuickStats\`: Sajikan statistik cepat (success rate, ROI, modal, dll).

---

**Jika Jawaban Tidak Sesuai atau Kasar:**
- Tetap tanggapi secara sopan dan profesional.
- Arahkan kembali ke topik usaha.
- Jangan memperpanjang konflik atau menunjukkan emosi negatif.

---

**Catatan Penting:**
- Selalu beri **teks sebelum dan sesudah** tool \`generateQuestion\` dipanggil.
- Jangan pernah memanggil \`generateQuestion\` lebih dari sekali dalam satu respons.
- Jika data sudah lengkap, pastikan semua tools analisis dipanggil **dalam satu kali respons terakhir**.
- Fokus Anda adalah membantu pengguna secara maksimal melalui dialog yang terarah dan hangat.

---

Bertindaklah sebagai konsultan bisnis yang profesional namun ramah, bantu pengguna membuat keputusan yang tepat untuk mengembangkan usahanya melalui tanya jawab dan insight mendalam.
`;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const tools = {
  generateQuestion: tool({
    description: "Membuat pertanyaan untuk user seputar usaha yang dijalankan",
    parameters: z.object({
      question: z.string().describe("Pertanyaan yang ditanyakan"),
      options: z
        .array(z.string())
        .describe("Pilihan jawaban dari pertanyaan yang ditanyakan"),
    }),
    execute: async (parameters) => {
      return parameters;
    },
  }),
  generateConclusion: tool({
    description:
      "Membuat kesimpulan dari pertanyaan yang ditanyakan dengan format markdown",
    parameters: z.object({
      conclusions: z
        .array(
          z.object({
            title: z.string().describe("Judul dari kesimpulan"),
            content: z.string().describe("Isi dari kesimpulan"),
            badge: z.string().describe("Kategori dari kesimpulan"),
          })
        )
        .describe(
          "Kesimpulan dari pertanyaan yang ditanyakan dengan format markdown"
        ),
    }),
    execute: async (parameters) => {
      return parameters;
    },
  }),
  generateKeyInsight: tool({
    description: "Membuat key insight dari pertanyaan yang ditanyakan",
    parameters: z.object({
      keyInsights: z
        .array(z.string())
        .describe("Key insight dari pertanyaan yang ditanyakan"),
    }),
    execute: async (parameters) => {
      return parameters;
    },
  }),
  generateRecommendation: tool({
    description: "Membuat rekomendasi dari pertanyaan yang ditanyakan",
    parameters: z.object({
      recommendations: z
        .array(z.string())
        .describe("Rekomendasi dari pertanyaan yang ditanyakan"),
    }),
    execute: async (parameters) => {
      return parameters;
    },
  }),
  generateProblems: tool({
    description:
      "Membuat tantangan yang akan dihadapi dari pertanyaan yang ditanyakan",
    parameters: z.object({
      problems: z
        .array(z.string())
        .describe(
          "Tantangan yang akan dihadapi dari pertanyaan yang ditanyakan"
        ),
    }),
    execute: async (parameters) => {
      return parameters;
    },
  }),
  generateQuickStats: tool({
    description: "Membuat statistik cepat dari pertanyaan yang ditanyakan",
    parameters: z.object({
      successRate: z
        .string()
        .describe("Tingkat kesuksesan dari usaha contoh: (0%-100%)"),
      minModal: z
        .string()
        .describe("Modal minimal dari usaha contoh: (5-10 juta)"),
      roi: z.string().describe("ROI estimasi dari usaha contoh: (6-12 bulan)"),
    }),
    execute: async (parameters) => {
      return parameters;
    },
  }),
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4.1"),
    providerOptions: {
      openai: {
        store: true,
      },
    },
    system: SYSTEM_PROMPT,
    tools,
    messages,
  });

  return result.toDataStreamResponse();
}
