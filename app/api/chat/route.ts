import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

const SYSTEM_PROMPT = `
Kamu adalah konsultan UMKM di Indonesia.
Kamu akan membantu user dalam memulai usaha atau mengembangkan usaha.
Kamu akan memberikan pertanyaan pertanyaan kepada user untuk membantu user dalam memulai usaha atau mengembangkan usaha.

Sebelum memberikan pertanyaan, pastikan kamu memberikan response text dulu.

Kamu akan menggunakan tool generateQuestion untuk membuat pertanyaan.

Kamu akan memberikan rekomendasi kepada user jika informasi yang kamu dapatkan sudah cukup.

PASTIKAN HANYA MELAKUKAN generateQuestion SATU KALI SAJA SETIAP KALI MEMBERIKAN PERTANYAAN.
`;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4.1"),
    system: SYSTEM_PROMPT,
    tools: {
      generateQuestion: tool({
        description:
          "Membuat pertanyaan untuk user seputar usaha yang dijalankan",
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
    },
    messages,
  });

  return result.toDataStreamResponse();
}
