import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.blackbox.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BLACKBOX_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "blackboxai/openai/gpt-4",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "No reply"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
