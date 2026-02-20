import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { postDb, userDb, likeDb, initTables } from '@/lib/db-json';

// 获取帖子列表
export async function GET(request: NextRequest) {
  try {
    await initTables()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // 获取当前用户ID
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    let posts = await postDb.findAll({ status: 'approved', category: category || undefined })

    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase()
      posts = posts.filter((p: any) =>
        p.title?.toLowerCase().includes(searchLower) ||
        p.content?.toLowerCase().includes(searchLower)
      )
    }

    const formattedPosts = await Promise.all(posts.map(async (post: any) => {
      // 检查用户是否点赞
      let isLiked = false
      if (userId) {
        isLiked = await likeDb.exists(userId, post.id)
      }

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
      }
    }))

    return NextResponse.json({ posts: formattedPosts })
  } catch (error: any) {
    console.error('Get posts error:', error)
    return NextResponse.json({
      error: '获取帖子失败',
      details: error?.message
    }, { status: 500 })
  }
}

// 发布新帖子
export async function POST(request: NextRequest) {
  try {
    await initTables()

    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const user = await userDb.findById(userId)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category, tags, images } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: '请输入帖子标题' }, { status: 400 })
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: '请输入帖子内容' }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: '请选择分类' }, { status: 400 })
    }

    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 创建帖子
    await postDb.create({
      id: postId,
      title: title.trim(),
      content: content.trim(),
      category,
      authorId: userId,
      authorName: user.name,
      authorAvatar: user.avatar || null,
      images: images ? JSON.stringify(images) : null,
      tags: tags ? JSON.stringify(tags) : null,
      likes: 0,
      comments: 0,
      status: 'approved',
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({
      message: '发布成功',
      post: {
        id: postId,
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags || [],
        images: images || [],
        author: {
          id: userId,
          name: user.name,
          avatar: user.avatar || ''
        },
        likes: 0,
        comments: 0,
        isLiked: false,
        status: 'approved',
        createdAt: new Date().toISOString().split('T')[0]
      }
    })
  } catch (error: any) {
    console.error('Create post error:', error)
    return NextResponse.json({
      error: '发布失败，请稍后重试',
      details: error?.message
    }, { status: 500 })
  }
}
