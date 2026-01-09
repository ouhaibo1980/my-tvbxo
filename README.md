# My TVBXO - Next.js Web Application

基于 Next.js 16、TypeScript 5 和 Tailwind CSS 4 的现代化 Web 应用。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
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

## 项目结构

```
.
├── src/
│   ├── app/          # Next.js App Router 页面
│   ├── components/   # React 组件
│   └── lib/          # 工具库
├── public/           # 静态资源
├── .coze            # 项目配置
└── wrangler.toml    # Cloudflare Workers/Pages 配置
```

## 部署指南

### 方案一：Cloudflare Pages（推荐，免费）

优点：
- ✅ 完全免费，无限带宽
- ✅ 全球 CDN 加速
- ✅ 免费 SSL 证书
- ✅ 自动从 GitHub 部署

**📋 详细配置指南**：请查看 [CLOUDFLARE-PAGES-CONFIG.md](CLOUDFLARE-PAGES-CONFIG.md) 了解详细的配置步骤和常见错误修复。
- ✅ 支持自定义域名

#### 部署步骤

**第一步：注册 Cloudflare 账号**
1. 访问：https://dash.cloudflare.com/sign-up
2. 使用邮箱注册
3. 验证邮箱

**第二步：连接 GitHub**
1. 登录后，点击左侧菜单 "Workers & Pages"
2. 点击 "Create application"
3. 选择 "Pages" 标签
4. 点击 "Connect to Git"
5. 选择 GitHub 并授权访问你的仓库

**第三步：导入项目**
1. 在 "Connect to Git" 中找到 `ouhaibo1980/my-tvbxo`
2. 点击 "Begin setup"

**第四步：配置构建设置（⚠️ 重要）**

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (留空)
Deploy command: (留空) ⚠️ 必须留空！
```

**⚠️ 关键注意事项：**
- ✅ **Build command**: `npm run build` - 必须填写
- ✅ **Build output directory**: `.next` - 填写 `.next` 目录
- ❌ **Deploy command**: **必须留空** - Cloudflare Pages 会自动部署
- ❌ **不要填写** `npx wrangler deploy` 或其他部署命令

**环境变量：**
- `NODE_VERSION`: `20`
- `NPM_VERSION`: `10`

**第五步：部署**
1. 点击 "Save and Deploy"
2. 等待 2-5 分钟
3. 访问 `https://my-tvbxo.pages.dev`

### 🚨 快速修复：Cloudflare Pages 部署失败

如果遇到 `Missing entry-point to Worker script or to assets directory` 错误：

**问题原因**：错误使用了 `npx wrangler deploy` 命令。

**解决方案（2 分钟内完成）**：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → 选择您的项目 **my-tvbxo**
3. 点击 **Settings** 标签页
4. 找到 **Builds & deployments** 部分
5. 点击 **Edit configurations**
6. **清空或删除** "Deploy command" 字段（不要填写任何内容）
7. **确认** 其他配置：
   - ✅ **Build command**: `npm run build`
   - ✅ **Build output directory**: `.next`（或留空）
   - ✅ **Root directory**: (留空)
8. 点击 **Save** 保存更改
9. 触发一次新的部署（推送代码或手动触发）

**详细文档**：请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

### 方案二：自己的服务器部署

部署到自己的服务器提供完全的控制权，适合需要运行后端 API 的项目。

详细步骤请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

## 开发工具

### 自动提交和推送

项目配置了文件监控自动提交系统：

```bash
# 启动自动监控
./manage-auto-commit.sh start

# 停止自动监控
./manage-auto-commit.sh stop

# 查看状态
./manage-auto-commit.sh status
```

### SSH 配置

项目使用 SSH 密钥进行 GitHub 认证，避免 Token 过期问题。

详细配置请查看 [SSH-SETUP.md](SSH-SETUP.md)

## 故障排除

### TypeScript 类型错误

```bash
# 运行类型检查
npx tsc --noEmit
```

### 构建失败

```bash
# 清理缓存
rm -rf .next node_modules
pnpm install
pnpm build
```

### Cloudflare Pages 部署问题

请查看 [DEPLOYMENT.md](DEPLOYMENT.md) 中的详细故障排除章节。

## 相关文档

- [DEPLOYMENT.md](DEPLOYMENT.md) - 详细部署指南
- [SSH-SETUP.md](SSH-SETUP.md) - SSH 密钥配置
- [.coze](.coze) - 项目启动配置

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
