import { Knowledge, UncommonQuestion, CommunityPost, User } from '@/types';

// 获取当前日期
const getCurrentDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// 获取过去某天的日期
const getPastDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// 知识文章数据
// 来源说明：本知识库内容整理自互联网公开资料、专业书籍及用户投稿
// 仅供参考学习，具体问题请咨询专业兽医
export const mockKnowledge: Knowledge[] = [
  {
    id: 'k001',
    title: '猫咪日常饮食指南：如何科学喂养',
    summary: '了解猫咪的营养需求，掌握正确的喂食方法，让你的猫咪健康长寿。',
    content: `猫咪是专性肉食动物，这意味着它们必须从动物蛋白中获取营养。

## 主要营养需求

### 蛋白质
猫咪需要高蛋白质饮食，建议蛋白质含量不低于26%。优质蛋白质来源包括鸡肉、鱼肉、牛肉等。

### 牛磺酸
牛磺酸对猫咪的心脏和眼睛健康至关重要。猫咪无法自行合成足够的牛磺酸，必须从食物中获取。

### 脂肪
适量的脂肪对猫咪的皮毛健康和能量供应很重要，但需控制摄入量以防肥胖。

## 喂食建议

1. 定时定量：建议每天喂食2-3次，避免自由采食导致的肥胖
2. 新鲜水源：保证猫咪随时有新鲜饮用水
3. 避免人类食物：洋葱、大蒜、巧克力等对猫咪有毒`,
    category: 'cat',
    tags: ['饮食', '营养', '健康', '新手必读'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 12580,
    likes: 892,
    createdAt: getPastDate(30),
    updatedAt: getPastDate(5),
    supplements: [],
    corrections: []
  },
  {
    id: 'k002',
    title: '猫咪行为解读：理解你的毛孩子',
    summary: '深入了解猫咪的各种行为语言，建立更好的人宠关系。',
    content: `猫咪通过多种方式表达它们的情绪和需求，理解这些信号对于建立良好的人宠关系至关重要。

## 尾巴语言

- 尾巴竖直：表示友好、自信
- 尾巴抖动：兴奋或紧张
- 尾巴蓬松：害怕或受到威胁
- 尾巴低垂：可能身体不适或心情不好

## 耳朵信号

- 耳朵向前：好奇、感兴趣
- 耳朵向两侧：恐惧或焦虑
- 耳朵向后平贴：愤怒或防御

## 声音交流

### 呼噜声
通常表示满足和放松，但也可能是疼痛或压力时的自我安抚。

### 喵叫
猫咪主要对人类使用喵叫，它们之间很少这样交流。`,
    category: 'cat',
    tags: ['行为', '心理学', '沟通', '进阶'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 8956,
    likes: 654,
    createdAt: getPastDate(25),
    updatedAt: getPastDate(10),
    supplements: [],
    corrections: []
  },
  {
    id: 'k003',
    title: '猫咪疫苗接种完全指南',
    summary: '了解猫咪需要接种哪些疫苗，接种时间和注意事项。',
    content: `疫苗接种是保护猫咪健康的重要措施。

## 核心疫苗

### 猫三联疫苗（FVRCP）
预防猫瘟热、猫鼻气管炎、猫杯状病毒
- 首次接种：6-8周龄
- 加强针：每隔3-4周接种一次，直到16周龄
- 成年猫：每年或每三年加强一次

### 狂犬疫苗
- 首次接种：12-16周龄
- 加强针：每年或每三年

## 接种注意事项

1. 接种前确保猫咪健康
2. 接种后观察是否有不良反应
3. 保存好疫苗接种记录`,
    category: 'cat',
    tags: ['疫苗', '医疗', '预防', '新手必读'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 7823,
    likes: 567,
    createdAt: getPastDate(20),
    updatedAt: getPastDate(3),
    supplements: [],
    corrections: []
  },
  {
    id: 'k004',
    title: '狗狗基础训练：从零开始',
    summary: '掌握狗狗基础训练技巧，培养听话乖巧的毛孩子。',
    content: `训练是狗狗成长过程中不可或缺的一部分，良好的训练可以让狗狗更好地融入家庭生活。

## 基础命令训练

### 坐下（Sit）
1. 手持零食靠近狗狗鼻子
2. 将手慢慢向上移动
3. 狗狗屁股着地时说"坐下"
4. 给予奖励

### 趴下（Down）
1. 让狗狗先坐下
2. 手持零食从狗狗鼻子向下移动到地面
3. 狗狗趴下时说"趴下"
4. 给予奖励

## 训练原则

- 正向强化：奖励好行为，忽略坏行为
- 一致性：所有家庭成员使用相同的指令和规则
- 耐心：训练需要时间和重复`,
    category: 'dog',
    tags: ['训练', '基础', '行为', '新手必读'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 15680,
    likes: 1123,
    createdAt: getPastDate(18),
    updatedAt: getPastDate(2),
    supplements: [],
    corrections: []
  },
  {
    id: 'k005',
    title: '狗狗品种选择指南',
    summary: '不同品种的狗狗有不同的特点，选择适合自己的品种很重要。',
    content: `选择一只适合自己的狗狗是养宠生活的第一步。

## 按体型分类

### 小型犬（<10kg）
- 泰迪/贵宾：聪明、不掉毛、需要定期美容
- 柯基：活泼、友善、易胖
- 比熊：温顺、可爱、需要社交

### 中型犬（10-25kg）
- 边境牧羊犬：最聪明、需要大量运动
- 柴犬：独立、干净、性格倔强
- 萨摩耶：友善、活泼、掉毛严重

### 大型犬（>25kg）
- 金毛：温顺、聪明、适合家庭
- 拉布拉多：友善、活泼、易训练

## 选择考虑因素

1. 居住空间：大型犬需要更多空间
2. 运动需求：根据自己能提供的运动量选择
3. 时间投入：长毛犬需要更多打理时间`,
    category: 'dog',
    tags: ['品种', '选择', '新手必读', '入门'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 23450,
    likes: 1876,
    createdAt: getPastDate(35),
    updatedAt: getPastDate(7),
    supplements: [],
    corrections: []
  },
  {
    id: 'k006',
    title: '虎皮鹦鹉饲养完全指南',
    summary: '从选鸟到日常护理，全面了解虎皮鹦鹉的饲养方法。',
    content: `虎皮鹦鹉是最受欢迎的宠物鸟之一，聪明、活泼、易于饲养。

## 选择鸟儿

### 健康标准
- 眼睛明亮有神
- 羽毛紧贴身体
- 鼻孔干净无分泌物
- 活泼好动

## 居住环境

### 笼子选择
- 最小尺寸：40×30×35cm
- 栖木直径：1-1.5cm

### 摆放位置
- 避免直射阳光
- 远离厨房油烟
- 温度保持在18-25°C

## 饮食

### 主食
- 小米、黍子、燕麦等混合谷物
- 专业鹦鹉饲料

### 禁忌食物
- 巧克力、咖啡
- 牛油果
- 高盐食物`,
    category: 'bird',
    tags: ['虎皮鹦鹉', '鸟类', '饲养', '新手必读'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 7845,
    likes: 567,
    createdAt: getPastDate(15),
    updatedAt: getPastDate(4),
    supplements: [],
    corrections: []
  },
  {
    id: 'k007',
    title: '豹纹守宫饲养入门',
    summary: '了解豹纹守宫的基本饲养方法，开始你的爬宠之旅。',
    content: `豹纹守宫是最适合新手的爬宠之一，温顺、易养、外形可爱。

## 基本介绍

豹纹守宫原产于巴基斯坦、印度等地的干旱地区，是一种夜行性地栖守宫。体长约20-25厘米，寿命可达15-20年。

## 饲养箱设置

### 尺寸要求
- 单只成年：40×30×30cm

### 温度控制
- 热区：30-32°C
- 冷区：24-26°C
- 夜间不低于20°C

## 饮食

### 食物种类
- 蟋蟀（主食）
- 面包虫
- 杜比亚蟑螂

### 喂食频率
- 幼体：每天喂食
- 成体：每2-3天喂食`,
    category: 'reptile',
    tags: ['豹纹守宫', '爬宠', '蜥蜴', '新手必读'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 12340,
    likes: 876,
    createdAt: getPastDate(22),
    updatedAt: getPastDate(6),
    supplements: [],
    corrections: []
  },
  {
    id: 'k008',
    title: '仓鼠饲养完全手册',
    summary: '从选择仓鼠到日常护理，一篇文章全搞定。',
    content: `仓鼠是小型哺乳动物中最受欢迎的宠物之一，适合空间有限的家庭。

## 品种选择

### 叙利亚仓鼠（金丝熊）
- 体型最大（15-18cm）
- 独居，必须单独饲养
- 性格温顺，适合新手

### 侏儒仓鼠
- 一线/三线：体型较小

## 饲养环境

### 笼子
- 最小底面积：60×40cm（越大越好）
- 底材：木屑、纸棉，厚度10cm以上
- 提供跑轮（直径≥20cm）

## 饮食

### 主食
- 专业仓鼠粮
- 混合谷物

### 禁忌食物
- 洋葱、大蒜
- 巧克力

## 注意事项

1. 必须独居（叙利亚仓鼠）
2. 夜行性动物
3. 寿命约2-3年
4. 不能用水洗澡（用浴沙）`,
    category: 'small_mammal',
    tags: ['仓鼠', '小型哺乳', '新手必读', '入门'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 18976,
    likes: 1432,
    createdAt: getPastDate(12),
    updatedAt: getPastDate(1),
    supplements: [],
    corrections: []
  },
  {
    id: 'k009',
    title: '热带鱼饲养入门指南',
    summary: '从开缸到日常维护，带你进入热带鱼的美丽世界。',
    content: `热带鱼饲养是一项需要耐心的爱好，正确的方法可以让你事半功倍。

## 新手开缸

### 设备准备
- 鱼缸：建议60cm起步
- 过滤器：保证水质稳定
- 加热棒：热带鱼需要恒温
- 灯具：照明和植物生长

### 开缸步骤
1. 清洗鱼缸和底砂
2. 布置造景和水草
3. 注水（除氯后的水）
4. 安装设备，开启过滤
5. 养水2-4周（建立硝化系统）

## 新手推荐鱼种

### 孔雀鱼
- 体型小、颜色多样
- 繁殖容易
- 水温：22-28°C

### 斑马鱼
- 体质强健
- 活泼好动
- 水温：20-25°C`,
    category: 'aquatic',
    tags: ['热带鱼', '水族', '开缸', '新手必读'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 15678,
    likes: 1123,
    createdAt: getPastDate(28),
    updatedAt: getPastDate(8),
    supplements: [],
    corrections: []
  },
  {
    id: 'k010',
    title: '兔子饲养全攻略',
    summary: '兔子是可爱的伴侣动物，需要特别的饮食和护理。',
    content: `兔子是受欢迎的小型哺乳动物，寿命可达8-12年，需要长期照顾。

## 品种选择

### 小型品种
- 荷兰侏儒兔
- 狮子头兔
- 耳垂兔

### 中型品种
- 荷兰兔
- 迷你雷克斯

## 饲养环境

### 笼子
- 最小尺寸：120×60×60cm
- 底部平整，避免铁丝网

## 饮食（重要！）

### 干草（主食）
- 提摩西草：无限量供应
- 幼兔可喂苜蓿草
- 最重要的食物来源

### 禁忌食物
- 巧克力
- 洋葱、大蒜
- 土豆
- 淀粉类食物`,
    category: 'small_mammal',
    tags: ['兔子', '小型哺乳', '草食动物', '新手必读'],
    source: {
      name: '综合整理',
      url: '',
      type: 'community'
    },
    author: '爪迹知识库',
    views: 14567,
    likes: 1098,
    createdAt: getPastDate(40),
    updatedAt: getPastDate(12),
    supplements: [],
    corrections: []
  }
]

// 非常见问题数据
export const mockQuestions: UncommonQuestion[] = [
  {
    id: 'q001',
    title: '我的猫咪只吃干粮不吃罐头怎么办？',
    content: '试了很多品牌的罐头都不吃，只吃干粮，担心营养不均衡...',
    author: '猫咪主人小王',
    category: 'cat',
    createdAt: getPastDate(5),
    answers: []
  }
]

// 社区帖子数据
export const mockPosts: CommunityPost[] = []

// 用户数据
export const mockUsers: User[] = []
