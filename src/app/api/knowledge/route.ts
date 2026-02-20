import { NextRequest, NextResponse } from 'next/server';
import { knowledgeDb, initTables } from '@/lib/db-json';
import { mockKnowledge } from '@/lib/mock-data';

// 自动初始化知识库数据
async function ensureKnowledgeData() {
  try {
    await initTables()
    const count = await knowledgeDb.count()
    if (count === 0) {
      console.log('知识库为空，正在导入初始数据...')
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
      console.log(`已导入 ${mockKnowledge.length} 条知识数据`)
    }
  } catch (error) {
    console.error('初始化知识库失败:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureKnowledgeData()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let knowledge = await knowledgeDb.findAll({ category: category || undefined })

    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase()
      knowledge = knowledge.filter((k: any) =>
        k.title?.toLowerCase().includes(searchLower) ||
        k.summary?.toLowerCase().includes(searchLower) ||
        k.content?.toLowerCase().includes(searchLower)
      )
    }

    // 格式化返回数据
    const formattedKnowledge = knowledge.map((k: any) => ({
      id: k.id,
      title: k.title,
      summary: k.summary,
      content: k.content,
      category: k.category,
      tags: k.tags ? JSON.parse(k.tags) : [],
      source: {
        name: k.sourceName,
        url: k.sourceUrl,
        type: k.sourceType
      },
      author: k.author,
      views: k.views,
      likes: k.likes,
      createdAt: k.createdAt,
      updatedAt: k.updatedAt,
      supplements: [],
      corrections: []
    }))

    return NextResponse.json({ knowledge: formattedKnowledge })
  } catch (error: any) {
    console.error('Get knowledge error:', error)
    return NextResponse.json({
      error: '获取知识失败',
      details: error?.message || '未知错误'
    }, { status: 500 })
  }
}
