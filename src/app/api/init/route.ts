import { NextRequest, NextResponse } from 'next/server';
import { initTables, knowledgeDb, userDb, postDb } from '@/lib/db-json';
import { mockKnowledge } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    console.log('开始初始化数据库...')
    await initTables()

    // 检查知识库是否已有数据
    const knowledgeCount = await knowledgeDb.count()

    if (knowledgeCount === 0) {
      console.log('开始导入知识库数据...')
      for (const k of mockKnowledge) {
        await knowledgeDb.create({
          id: k.id,
          title: k.title,
          summary: k.summary,
          content: k.content,
          category: k.category,
          tags: JSON.stringify(k.tags),
          sourceName: k.source.name,
          sourceUrl: k.source.url || '',
          sourceType: k.source.type,
          author: k.author,
          views: k.views,
          likes: k.likes,
          createdAt: k.createdAt,
          updatedAt: k.updatedAt
        })
      }
      console.log(`知识库导入完成，共 ${mockKnowledge.length} 条`)
    }

    const stats = {
      knowledge: await knowledgeDb.count(),
      users: await userDb.count(),
      posts: await postDb.count()
    }

    return NextResponse.json({
      success: true,
      message: '数据库初始化成功',
      stats
    })
  } catch (error: any) {
    console.error('初始化失败:', error)
    return NextResponse.json({
      success: false,
      error: '初始化失败',
      details: error?.message || '未知错误'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await initTables()

    const stats = {
      knowledge: await knowledgeDb.count(),
      users: await userDb.count(),
      posts: await postDb.count()
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || '获取状态失败'
    }, { status: 500 })
  }
}
