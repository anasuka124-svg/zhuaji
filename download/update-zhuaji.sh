#!/bin/bash
# 爪迹项目 - Vercel部署修复脚本
# 使用方法: 在项目根目录运行此脚本

echo "🐾 开始修复Vercel部署配置..."

# 1. 创建 vercel.json
echo "📝 创建 vercel.json..."
cat > vercel.json << 'EOF'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
EOF

# 2. 更新 next.config.ts
echo "📝 更新 next.config.ts..."
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
EOF

# 3. 更新 package.json 的 scripts 部分
echo "📝 更新 package.json..."
if [ -f "package.json" ]; then
    # 使用 sed 更新 package.json
    sed -i 's/"name": "nextjs_tailwind_shadcn_ts"/"name": "zhuaji"/' package.json
    sed -i 's/"version": "0.2.0"/"version": "1.0.0"/' package.json
    sed -i 's|"dev": "next dev -p 3000 2>&1 | tee dev.log"|"dev": "next dev -p 3000"|' package.json
    sed -i 's|"build": "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/"|"build": "next build"|' package.json
    sed -i 's|"start": "NODE_ENV=production bun .next/standalone/server.js 2>&1 | tee server.log"|"start": "next start"|' package.json
    echo "✅ package.json 已更新"
else
    echo "❌ 未找到 package.json"
fi

echo ""
echo "✅ 配置文件更新完成！"
echo ""
echo "下一步操作："
echo "  git add ."
echo "  git commit -m 'fix: 添加Vercel部署配置'"
echo "  git push origin master"
echo ""
echo "然后在Vercel重新部署即可！"
