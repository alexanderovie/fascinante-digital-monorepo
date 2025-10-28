/**
 * API Route ejemplo que usa contexto automático
 * NEXT.JS 15.5.6 App Router
 */

import { answer } from '@/src/lib/ai/answer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // La función answer() automáticamente inyecta contexto fresco
    const content = await answer([
      { role: 'user', content: String(prompt) }
    ]);

    return NextResponse.json({
      ok: true,
      content
    });

  } catch (error) {
    console.error('Error in ask API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

