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

    // 获取用户的帖子
    const posts = await postDb.findByAuthorId(userId);

    const formattedPosts = await Promise.all(posts.map(async (post: any) => {
      // 检查是否被点赞（这里用于显示点赞数）
      const isLiked = await likeDb.exists(userId, post.id);

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags ? JSON.parse(post.tags) : [],
        images: post.images ? JSON.parse(post.images) : [],
        author: {
          id: post.authorId,
          name: post.authorName || '未知用户',
          avatar: post.authorAvatar || ''
        },
        likes: post.likes || 0,
        comments: post.comments || 0,
        isLiked,
        status: post.status,
        createdAt: post.createdAt
      };
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error: any) {
    console.error('Get user posts error:', error);
    return NextResponse.json({
      error: '获取帖子失败',
      details: error?.message
    }, { status: 500 });
  }
}
