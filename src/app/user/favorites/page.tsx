'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Knowledge {
  id: string
  title: string
  summary: string
  category: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<Knowledge[]>([])
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

      // 获取收藏的知识（从用户数据中获取）
      if (data.user.favorites && data.user.favorites.length > 0) {
        // 这里应该从API获取收藏的知识详情
        setFavorites([])
      }
    } catch (error) {
      console.error('获取用户数据失败:', error)
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-xl font-bold">我的收藏</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-400 mb-2">暂无收藏</h2>
            <p className="text-gray-400 mb-6">浏览知识库时点击收藏按钮即可添加</p>
            <Button onClick={() => router.push('/knowledge')}>
              <BookOpen className="w-4 h-4 mr-2" />
              浏览知识库
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/knowledge/${item.id}`)}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
