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

    const apiKey = process.env.ARK_API_KEY;
    const model = process.env.ARK_MODEL;

    if (!apiKey || !model) {
      return NextResponse.json(
        { error: 'API configuration not found' },
        { status: 500 }
      );
    }

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是贵州水族专属文化向导，专门回答水族文化相关问题。重点回答以下问题：贵州赛马训练、水族拦门酒度数、水族端节时长、马尾绣制作工艺、水族音乐类型。同时也回答其他水族、马尾绣、水书、村寨民俗相关问题。对于完全无关的问题，请礼貌回绝并引导用户询问水族文化相关内容。请用友好、专业的语气回答，提供准确的文化背景信息。'
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Doubao API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Doubao API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || '抱歉，我无法回答这个问题。';

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Doubao API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
