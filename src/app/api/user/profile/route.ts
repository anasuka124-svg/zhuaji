import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { userDb, initTables } from '@/lib/db-json';

export async function PUT(request: NextRequest) {
  try {
    await initTables()

    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const body = await request.json()
    const { name, avatar } = body

    // 检查是否有更新内容
    if (!name && !avatar) {
      return NextResponse.json({ error: '没有需要更新的内容' }, { status: 400 })
    }

    // 如果更新用户名，检查是否已存在
    if (name) {
      if (name.length < 2 || name.length > 20) {
        return NextResponse.json({ error: '用户名长度应为2-20个字符' }, { status: 400 })
      }

      const existingUser = await userDb.findByName(name)
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: '用户名已被使用' }, { status: 400 })
      }
    }

    // 更新用户信息
    await userDb.updateProfile(userId, { name, avatar })

    const user = await userDb.findById(userId)

    return NextResponse.json({
      message: '更新成功',
      user: {
        id: user?.id,
        name: user?.name,
        avatar: user?.avatar || '',
        userType: user?.userType as 'pet_owner' | 'non_pet_owner',
        verified: !!user?.verified,
        petPhotos: user?.petPhotos ? JSON.parse(user.petPhotos) : [],
        quizPassed: !!user?.quizPassed,
        favorites: user?.favorites ? JSON.parse(user.favorites) : [],
        createdAt: user?.createdAt
      }
    })
  } catch (error: any) {
    console.error('Update profile error:', error)
    return NextResponse.json({
      error: '更新失败，请稍后重试',
      details: error?.message
    }, { status: 500 })
  }
}
