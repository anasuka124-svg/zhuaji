import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { postDb, likeDb, initTables } from '@/lib/db-json';

export async function GET() {
  try {
    await initTables();

    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    // 获取用户帖子数
    const postCount = await postDb.countByAuthorId(userId);
    
    // 获取用户获得的点赞数
    const likesReceived = await likeDb.countReceivedLikesByUserId(userId);

    return NextResponse.json({
      postCount,
      likesReceived
    });
  } catch (error: any) {
    console.error('Get user stats error:', error);
    return NextResponse.json({
      error: '获取统计数据失败',
      details: error?.message
    }, { status: 500 });
  }
}
