import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { userDb, initTables } from '@/lib/db-json';

export async function GET(request: NextRequest) {
  try {
    await initTables()

    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const user = await userDb.findById(userId)

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
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
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
