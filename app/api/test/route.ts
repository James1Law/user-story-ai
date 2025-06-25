export async function GET() {
  return new Response(
    JSON.stringify({
      message: "API routes are working",
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  )
}

export async function POST() {
  return new Response(
    JSON.stringify({
      message: "POST method working",
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  )
}
