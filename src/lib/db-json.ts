import fs from 'fs'
import path from 'path'

// 数据文件路径
const DATA_DIR = '/tmp/zhuaji-data'
const DATA_FILE = path.join(DATA_DIR, 'data.json')

// 数据结构
interface DataStore {
  users: any[]
  posts: any[]
  knowledge: any[]
  likes: any[]
  comments: any[]
}

// 初始化数据
const defaultData: DataStore = {
  users: [],
  posts: [],
  knowledge: [],
  likes: [],
  comments: []
}

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// 读取数据
function readData(): DataStore {
  try {
    ensureDataDir()
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8')
      return JSON.parse(content)
    }
    return { ...defaultData }
  } catch (error) {
    console.error('读取数据失败:', error)
    return { ...defaultData }
  }
}

// 写入数据
function writeData(data: DataStore) {
  try {
    ensureDataDir()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('写入数据失败:', error)
  }
}

// 内存缓存
let memoryData: DataStore | null = null

function getData(): DataStore {
  if (!memoryData) {
    memoryData = readData()
  }
  return memoryData
}

function saveData() {
  if (memoryData) {
    writeData(memoryData)
  }
}

// 知识库操作
export const knowledgeDb = {
  async count() {
    return getData().knowledge.length
  },

  async findAll(where?: { category?: string }) {
    const data = getData()
    let items = data.knowledge

    if (where?.category && where.category !== 'all') {
      items = items.filter(k => k.category === where.category)
    }

    return items
  },

  async findById(id: string) {
    const data = getData()
    return data.knowledge.find(k => k.id === id)
  },

  async create(item: any) {
    const data = getData()
    data.knowledge.push(item)
    saveData()
    return item.id
  },

  async incrementViews(id: string) {
    const data = getData()
    const item = data.knowledge.find(k => k.id === id)
    if (item) {
      item.views = (item.views || 0) + 1
      saveData()
    }
  }
}

// 用户操作
export const userDb = {
  async count() {
    return getData().users.length
  },

  async findById(id: string) {
    const data = getData()
    return data.users.find(u => u.id === id)
  },

  async findByName(name: string) {
    const data = getData()
    return data.users.find(u => u.name === name)
  },

  async create(user: any) {
    const data = getData()
    data.users.push(user)
    saveData()
    return user.id
  },

  async updateProfile(id: string, updates: { name?: string; avatar?: string }) {
    const data = getData()
    const user = data.users.find(u => u.id === id)
    if (user) {
      if (updates.name) user.name = updates.name
      if (updates.avatar !== undefined) user.avatar = updates.avatar
      saveData()
    }
  }
}

// 帖子操作
export const postDb = {
  async count() {
    return getData().posts.length
  },

  async findAll(where?: { category?: string; status?: string }) {
    const data = getData()
    let items = data.posts

    if (where?.status) {
      items = items.filter(p => p.status === where.status)
    }
    if (where?.category && where.category !== 'all') {
      items = items.filter(p => p.category === where.category)
    }

    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async findById(id: string) {
    const data = getData()
    return data.posts.find(p => p.id === id)
  },

  async findByAuthorId(authorId: string) {
    const data = getData()
    return data.posts
      .filter(p => p.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async countByAuthorId(authorId: string) {
    const data = getData()
    return data.posts.filter(p => p.authorId === authorId).length
  },

  async create(post: any) {
    const data = getData()
    data.posts.push(post)
    saveData()
    return post.id
  },

  async incrementLikes(id: string) {
    const data = getData()
    const post = data.posts.find(p => p.id === id)
    if (post) {
      post.likes = (post.likes || 0) + 1
      saveData()
    }
  }
}

// 点赞操作
export const likeDb = {
  async create(like: { id: string; userId: string; postId: string }) {
    const data = getData()
    const exists = data.likes.some(l => l.userId === like.userId && l.postId === like.postId)
    if (!exists) {
      data.likes.push(like)
      saveData()
      return true
    }
    return false
  },

  async delete(userId: string, postId: string) {
    const data = getData()
    const index = data.likes.findIndex(l => l.userId === userId && l.postId === postId)
    if (index !== -1) {
      data.likes.splice(index, 1)
      saveData()
      return true
    }
    return false
  },

  async exists(userId: string, postId: string) {
    const data = getData()
    return data.likes.some(l => l.userId === userId && l.postId === postId)
  },

  async findByPostId(postId: string) {
    const data = getData()
    return data.likes.filter(l => l.postId === postId)
  },

  // 计算用户获得的点赞总数（通过用户的所有帖子）
  async countReceivedLikesByUserId(userId: string) {
    const data = getData()
    // 找到用户的所有帖子ID
    const userPostIds = data.posts
      .filter(p => p.authorId === userId)
      .map(p => p.id)
    // 计算这些帖子的点赞总数
    return data.likes.filter(l => userPostIds.includes(l.postId)).length
  }
}

// 帖子扩展操作
export const postDbExtended = {
  async incrementLikes(id: string) {
    const data = getData()
    const post = data.posts.find(p => p.id === id)
    if (post) {
      post.likes = (post.likes || 0) + 1
      saveData()
      return post.likes
    }
    return 0
  },

  async decrementLikes(id: string) {
    const data = getData()
    const post = data.posts.find(p => p.id === id)
    if (post && post.likes > 0) {
      post.likes = post.likes - 1
      saveData()
      return post.likes
    }
    return post?.likes || 0
  },

  async incrementComments(id: string) {
    const data = getData()
    const post = data.posts.find(p => p.id === id)
    if (post) {
      post.comments = (post.comments || 0) + 1
      saveData()
      return post.comments
    }
    return 0
  }
}

// 评论操作
export const commentDb = {
  async create(comment: { id: string; postId: string; userId: string; userName: string; userAvatar?: string; content: string; createdAt: string }) {
    const data = getData()
    data.comments.push(comment)
    saveData()
    return comment.id
  },

  async findByPostId(postId: string) {
    const data = getData()
    return data.comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  },

  async countByPostId(postId: string) {
    const data = getData()
    return data.comments.filter(c => c.postId === postId).length
  }
}

// 初始化数据表（兼容接口）
export async function initTables() {
  ensureDataDir()
  if (!fs.existsSync(DATA_FILE)) {
    writeData({ ...defaultData })
  }
  return true
}
