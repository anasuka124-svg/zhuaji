import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { likeDb, postDbExtended, initTables } from '@/lib/db-json';

// 点赞/取消点赞
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initTables();

    const { id: postId } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    // 检查是否已点赞
    const hasLiked = await likeDb.exists(userId, postId);

    if (hasLiked) {
      // 取消点赞
      await likeDb.delete(userId, postId);
      const likes = await postDbExtended.decrementLikes(postId);
      return NextResponse.json({ liked: false, likes });
    } else {
      // 添加点赞
      const likeId = `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await likeDb.create({ id: likeId, userId, postId });
      const likes = await postDbExtended.incrementLikes(postId);
      return NextResponse.json({ liked: true, likes });
    }
  } catch (error: any) {
    console.error('Like error:', error);
    return NextResponse.json({
      error: '操作失败',
      details: error?.message
    }, { status: 500 });
  }
}
