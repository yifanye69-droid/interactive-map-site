import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // TODO: Replace with your actual AI API configuration
    // Example using OpenAI API:
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //       ...history.map((msg: any) => ({
    //         role: msg.role,
    //         content: msg.content,
    //       })),
    //       { role: 'user', content: message },
    //     ],
    //   }),
    // });
    // const data = await response.json();
    // return NextResponse.json({ content: data.choices[0].message.content });

    // Simulated response for now
    return NextResponse.json({
      content: "这是一个模拟的AI回复。请在API路由中配置实际的AI服务（如OpenAI、Claude等）。",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
