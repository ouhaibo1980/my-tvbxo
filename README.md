# My TVBXO

基于 Next.js 16、TypeScript 5 和 Tailwind CSS 4 的现代化 Web 应用。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 5000）
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **包管理器**: pnpm
- **Node.js**: 20+

## 自动提交系统

项目使用 SSH 密钥进行 GitHub 认证，并配置了文件监控自动提交系统。

```bash
# 启动自动监控
./manage-auto-commit.sh start

# 停止自动监控
./manage-auto-commit.sh stop

# 查看状态
./manage-auto-commit.sh status
```

## 部署

### Cloudflare Pages（推荐）

1. 访问 https://dash.cloudflare.com/sign-up 注册账号
2. 进入 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. 选择 GitHub 仓库
4. 配置构建设置：
   - Build command: `pnpm run build`
   - Build output directory: `.next`
   - Deploy command: **(留空)** ⚠️
5. 点击 **Save and Deploy**

部署成功后访问：`https://my-tvbxo.pages.dev`

## 故障排除

```bash
# 清理缓存
rm -rf .next node_modules
pnpm install
pnpm build

# 类型检查
npx tsc --noEmit
```
