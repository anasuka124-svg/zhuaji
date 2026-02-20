'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PenTool, MessageSquare, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ContributionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()

        if (!data.user) {
          router.push('/user/login')
          return
        }
      } catch (error) {
        console.error('获取用户数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/user" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">我的贡献</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="posts">
              <PenTool className="w-4 h-4 mr-2" />
              我的帖子
            </TabsTrigger>
            <TabsTrigger value="supplements">
              <FileText className="w-4 h-4 mr-2" />
              知识补充
            </TabsTrigger>
            <TabsTrigger value="corrections">
              <MessageSquare className="w-4 h-4 mr-2" />
              纠错建议
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="text-center py-16">
              <PenTool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-400 mb-2">帖子统计</h2>
              <p className="text-gray-400 mb-6">您的发帖数量和获赞数已在个人中心展示</p>
              <Button onClick={() => router.push('/user')}>
                查看个人中心
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="supplements">
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-400 mb-2">暂无补充内容</h2>
              <p className="text-gray-400 mb-6">在知识库中为文章添加补充信息</p>
              <Button onClick={() => router.push('/knowledge')}>
                浏览知识库
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="corrections">
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-400 mb-2">暂无纠错建议</h2>
              <p className="text-gray-400 mb-6">发现知识库中的错误？提交纠错建议</p>
              <Button onClick={() => router.push('/knowledge')}>
                浏览知识库
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
