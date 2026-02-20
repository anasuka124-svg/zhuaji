import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { commentDb, postDbExtended, userDb, initTables } from '@/lib/db-json';

// 获取评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initTables();

    const { id: postId } = await params;
    const comments = await commentDb.findByPostId(postId);

    const formattedComments = comments.map((c: any) => ({
      id: c.id,
      content: c.content,
      author: {
        id: c.userId,
        name: c.userName,
        avatar: c.userAvatar || ''
      },
      createdAt: c.createdAt
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json({
      error: '获取评论失败',
      details: error?.message
    }, { status: 500 });
  }
}

// 发表评论
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

    const user = await userDb.findById(userId);
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: '评论内容不能为空' }, { status: 400 });
    }

    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const commentData = {
      id: commentId,
      postId,
      userId,
      userName: user.name,
      userAvatar: user.avatar || '',
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    await commentDb.create(commentData);
    await postDbExtended.incrementComments(postId);

    return NextResponse.json({
      message: '评论成功',
      comment: {
        id: commentId,
        content: content.trim(),
        author: {
          id: userId,
          name: user.name,
          avatar: user.avatar || ''
        },
        createdAt: commentData.createdAt
      }
    });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json({
      error: '评论失败',
      details: error?.message
    }, { status: 500 });
  }
}
