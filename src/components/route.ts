import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const responseText = chatCompletion.choices[0].message.content;

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ error: 'Failed to communicate with OpenAI API' }, { status: 500 });
  }
}