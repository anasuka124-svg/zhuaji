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

  async exists(userId: string, postId: string) {
    const data = getData()
    return data.likes.some(l => l.userId === userId && l.postId === postId)
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
