import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是贵州水族文化向导，专门回答水族、马尾绣、水书、村寨相关问题。请用友好、专业的语气回答，提供准确的文化背景信息。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('DeepSeek API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return NextResponse.json(
        { error: `DeepSeek API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('DeepSeek API response data:', JSON.stringify(data).substring(0, 200));
    const aiMessage = data.choices[0]?.message?.content || '抱歉，我无法回答这个问题。';

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
