import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4-turbo"),
    system: `You are BizConsult AI, an expert business consultant specializing in helping small to medium-sized businesses. You provide strategic advice on:

- Business strategy and planning
- Marketing and customer acquisition
- Financial management and budgeting
- Operations optimization
- Digital transformation
- Team management and HR
- Market analysis and competitive positioning
- Growth strategies and scaling

Always provide practical, actionable advice tailored to SMBs. Be professional yet approachable, and ask clarifying questions when needed to give more specific recommendations.`,
    messages,
  })

  return result.toDataStreamResponse()
}
