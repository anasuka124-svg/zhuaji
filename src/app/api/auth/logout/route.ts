import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // 清除用户ID cookie
    cookieStore.delete('userId');
    
    return NextResponse.json({ message: '退出登录成功' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: '退出登录失败' }, { status: 500 });
  }
}
