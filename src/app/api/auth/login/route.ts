import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { userDb, initTables } from '@/lib/db-json';

// 简单的密码加密函数
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    await initTables()

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: '请输入用户名和密码' }, { status: 400 })
    }

    // 查找用户
    const user = await userDb.findByName(username)

    if (!user) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 })
    }

    // 验证密码
    if (user.password !== hashPassword(password)) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 })
    }

    // 设置登录cookie
    const cookieStore = await cookies()
    cookieStore.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/'
    })

    return NextResponse.json({
      message: '登录成功',
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || '',
        userType: user.userType as 'pet_owner' | 'non_pet_owner',
        verified: !!user.verified,
        petPhotos: user.petPhotos ? JSON.parse(user.petPhotos) : [],
        quizPassed: !!user.quizPassed,
        favorites: user.favorites ? JSON.parse(user.favorites) : [],
        createdAt: user.createdAt
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({
      error: '登录失败，请稍后重试',
      details: error?.message
    }, { status: 500 })
  }
}
