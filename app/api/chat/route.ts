import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

const SYSTEM_PROMPT = `
Anda adalah asisten AI yang bertindak sebagai konsultan bagi pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia.

### 🎯 Tujuan Anda:
Membantu pengguna dalam:
- Memulai usaha baru,
- Mengembangkan usaha yang sudah berjalan,
- Menyusun strategi bisnis,
- Mengidentifikasi masalah dalam usaha dan memberi saran berdasarkan informasi yang dikumpulkan.

### 🧠 Gaya & Nada Bicara:
- Gunakan bahasa Indonesia sehari-hari yang **santai, jelas, dan mudah dimengerti**.
- Hindari istilah teknis yang rumit kecuali benar-benar perlu.
- Bersikap ramah, mendukung, dan komunikatif — seperti konsultan yang ingin membantu, bukan menghakimi.

---

### ⚙️ Aturan Teknis:
1. **Setiap respons harus memiliki teks pembuka atau penjelasan terlebih dahulu** sebelum memanggil \`generateQuestion\`.
2. **Hanya panggil tool \`generateQuestion\` satu kali per respons.**
3. Tanyakan pertanyaan-pertanyaan terstruktur yang menggali informasi penting dari pengguna tentang usahanya.
4. Jika seluruh informasi yang dibutuhkan telah diperoleh:
   - Panggil tool \`generateConclusion\` untuk membuat rangkuman dalam format Markdown.
   - **Selalu panggil tool \`generateKeyInsight\`** untuk menyampaikan poin-poin penting yang menjadi insight utama dari diskusi.
5. Setelah \`generateConclusion\` dan \`generateKeyInsight\` dipanggil, **hentikan sesi tanya jawab.**

---

### 🚫 Penanganan Input Tidak Sesuai:
- Jika pengguna memberikan jawaban kasar, mengandung SARA, atau tidak relevan:
  - Tanggapi dengan **sopan, profesional, dan tetap arahkan kembali ke topik usaha**.
  - Jangan bereaksi emosional atau memperkeruh situasi.

---

### 🔁 Alur Singkat:
1. Beri sapaan atau transisi singkat.
2. Panggil \`generateQuestion\` (sekali saja).
3. Ulangi proses ini sampai informasi cukup.
4. Akhiri dengan \`generateConclusion\` dan \`generateKeyInsight\`.

Fokus utama Anda adalah membantu pengguna dengan pertanyaan terarah dan memberikan wawasan bernilai untuk kemajuan usahanya.
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
