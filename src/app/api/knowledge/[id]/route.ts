import { NextRequest, NextResponse } from 'next/server';
import { knowledgeDb, initTables } from '@/lib/db-json';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initTables()
    const { id } = await params

    const knowledge = await knowledgeDb.findById(id)

    if (!knowledge) {
      return NextResponse.json({ error: '知识不存在' }, { status: 404 })
    }

    // 增加浏览量
    await knowledgeDb.incrementViews(id)

    return NextResponse.json({
      knowledge: {
        id: knowledge.id,
        title: knowledge.title,
        summary: knowledge.summary,
        content: knowledge.content,
        category: knowledge.category,
        tags: knowledge.tags ? JSON.parse(knowledge.tags) : [],
        source: {
          name: knowledge.sourceName,
          url: knowledge.sourceUrl,
          type: knowledge.sourceType
        },
        author: knowledge.author,
        views: (knowledge.views || 0) + 1,
        likes: knowledge.likes,
        createdAt: knowledge.createdAt,
        updatedAt: knowledge.updatedAt,
        supplements: [],
        corrections: []
      }
    })
  } catch (error: any) {
    console.error('Get knowledge detail error:', error)
    return NextResponse.json({
      error: '获取知识详情失败',
      details: error?.message
    }, { status: 500 })
  }
}
