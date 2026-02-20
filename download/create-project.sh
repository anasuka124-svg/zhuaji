# 爪迹项目创建脚本
# 在您的电脑上创建一个文件夹，把此脚本放进去运行

# 创建目录结构
mkdir -p src/app/knowledge/\[id\]
mkdir -p src/app/user/login
mkdir -p src/app/user/register
mkdir -p src/app/questions
mkdir -p src/app/community
mkdir -p src/app/api
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/types
mkdir -p public

# 初始化 package.json
cat > package.json << 'PACKAGE_EOF'
{
  "name": "zhuaji",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.11",
    "lucide-react": "^0.468.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-sheet": "^1.1.2"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^20.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-config-next": "^15.1.0"
  }
}
PACKAGE_EOF

echo "目录结构和 package.json 创建完成！"
echo "请访问 https://github.com/anasuka124-svg/zhuaji 上传此项目"
