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
    const { username, password, userType, petPhotos, quizPassed } = body

    if (!username || !password || !userType) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    if (username.length < 2 || username.length > 20) {
      return NextResponse.json({ error: '用户名长度应为2-20个字符' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码长度至少6个字符' }, { status: 400 })
    }

    if (userType !== 'pet_owner' && userType !== 'non_pet_owner') {
      return NextResponse.json({ error: '无效的用户类型' }, { status: 400 })
    }

    // 养宠人需要上传宠物照片
    if (userType === 'pet_owner' && (!petPhotos || petPhotos.length === 0)) {
      return NextResponse.json({ error: '请上传至少一张宠物照片' }, { status: 400 })
    }

    // 非养宠人需要通过测试
    if (userType === 'non_pet_owner' && !quizPassed) {
      return NextResponse.json({ error: '请先通过宠物安全知识测试' }, { status: 400 })
    }

    // 检查用户名是否已存在
    const existingUser = await userDb.findByName(username)

    if (existingUser) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 400 })
    }

    // 创建用户
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await userDb.create({
      id: userId,
      name: username,
      password: hashPassword(password),
      email: `${username}@zhuaji.local`,
      userType,
      verified: true,
      petPhotos: petPhotos ? JSON.stringify(petPhotos) : null,
      quizPassed: quizPassed || false,
      favorites: '[]',
      avatar: null,
      createdAt: new Date().toISOString()
    })

    // 设置登录cookie
    const cookieStore = await cookies()
    cookieStore.set('userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/'
    })

    return NextResponse.json({
      message: '注册成功',
      user: {
        id: userId,
        name: username,
        avatar: '',
        userType: userType as 'pet_owner' | 'non_pet_owner',
        verified: true,
        petPhotos: petPhotos || [],
        quizPassed: quizPassed || false,
        favorites: [],
        createdAt: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json({
      error: '注册失败，请稍后重试',
      details: error?.message || '未知错误'
    }, { status: 500 })
  }
}
