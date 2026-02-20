'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PenTool, MessageSquare, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Post {
  id: string
  title: string
  content: string
  category: string
  likes: number
  createdAt: string
}

export default function ContributionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()

      if (!data.user) {
        router.push('/user/login')
        return
      }

      setUser(data.user)

      // 获取用户的帖子
      // 这里应该从API获取用户贡献的内容
      setPosts([])
    } catch (error) {
      console.error('获取用户数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      cat: '猫咪',
      dog: '狗狗',
      bird: '鸟类',
      reptile: '爬宠',
      small_mammal: '小型哺乳',
      aquatic: '水族',
      other: '其他'
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
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
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <PenTool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-400 mb-2">暂无帖子</h2>
                <p className="text-gray-400 mb-6">在社区分享你的养宠经验吧</p>
                <Button onClick={() => router.push('/community')}>
                  前往社区
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                          {getCategoryLabel(post.category)}
                        </span>
                        <span className="text-xs text-gray-400">{post.createdAt}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{post.content}</p>
                      <div className="mt-3 text-sm text-gray-400">
                        ❤️ {post.likes} 点赞
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
