import OpenAI from "openai"

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("API route called")

  try {
    // Check if OpenAI package is available
    if (!OpenAI) {
      console.error("OpenAI package not found")
      return new Response(JSON.stringify({ error: "OpenAI package not installed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check API key
    console.log("OPENAI_API_KEY (debug):", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.slice(0,5) + "..." + process.env.OPENAI_API_KEY.slice(-5) : undefined)
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found")
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Parse request body
    let prompt
    try {
      const body = await req.json()
      prompt = body.prompt
      console.log("Received prompt:", prompt)
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Initialize OpenAI
    let openai
    try {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      console.log("OpenAI client initialized")
    } catch (initError) {
      console.error("Failed to initialize OpenAI:", initError)
      return new Response(JSON.stringify({ error: "Failed to initialize OpenAI client" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Make OpenAI API call
    console.log("Making OpenAI API call...")
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a Product Management assistant that generates clear, professional Agile User Stories from plain English prompts.

Your role is to:
Convert user input into a structured Agile User Story.
Follow the formatting template exactly.
Ensure every line in the Acceptance Criteria section begins with '- ' and nothing else.
Always use British English spelling.
Never include explanations, intros, or apologies — only return the formatted story.

User Story Format:

Title: [Concise summary of the feature]
As a [User or role]
I want to [What the user wants to do]
So that [Why they want to do it / value]

Acceptance Criteria:
- Each item must begin with a simple dash and space, like '- ', not a markdown checkbox
- Do not use '[ ]' or any checkbox-style syntax
- List testable functional behaviour, validations, or edge cases
- List fallback handling or conditional logic if needed
- Add additional testable details as needed

Design Link (optional):
[ ]

Strict Formatting Rules:
Each line in the Acceptance Criteria section must begin with '- ' followed by a space.
Do not use bullet, emoji, or asterisk characters before or instead of checkboxes.
Do not wrap checkboxes in markdown lists (e.g. no '* - [ ]' or '• [ ]')
Double-check output before returning: if any checkbox line is incorrect, fix it immediately.

Behaviour Guidelines:
If the user input is descriptive, infer the full story and criteria.
If the prompt is vague, ask brief clarifying questions before outputting.
Be proactive — include fallback logic or edge cases if they're implied.
Ensure every acceptance criterion is testable and formatted properly.
Output the story as plain text, with no code block, markdown fencing, or triple backticks.

Example Input and Output:
Input: Let users remove port calls from the itinerary.
Expected Output:
Title: Remove Port Call from Itinerary
As a Voyage Planner
I want to remove a port call from the itinerary
So that I can quickly update the voyage plan when a stop is cancelled
Acceptance Criteria:
- User can click a "Remove" icon or button on a port call
- System prompts for confirmation before deletion
- Upon confirmation, the port call is removed from the list
- Recalculated ETA/ETD values are displayed for remaining ports
- Removed port calls are excluded from all voyage cost estimates and reports
Design Link (optional):
[ ]

If any Acceptance Criteria item uses checkbox-style formatting like '- [ ]', stop and regenerate using simple bullet points only.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const story = completion.choices[0]?.message?.content || "No story generated"
    console.log("Story generated successfully, length:", story.length)

    return new Response(JSON.stringify({ story }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Detailed error:", error)

    let errorMessage = "Unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
