import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', name: '爪迹' });
}
