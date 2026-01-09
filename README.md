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

### Cloudflare Pages（推荐，免费）

优点：
- ✅ 完全免费，无限带宽
- ✅ 全球 CDN 加速
- ✅ 免费 SSL 证书
- ✅ 自动从 GitHub 部署

**详细步骤和故障排除**：👉 [DEPLOYMENT.md](DEPLOYMENT.md)

### 快速部署

1. 注册 Cloudflare 账号：https://dash.cloudflare.com/sign-up
2. 进入 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. 选择 `ouhaibo1980/my-tvbxo` 仓库
4. 配置构建设置：
   - Build command: `pnpm run build`
   - Build output directory: `.next`
   - **Deploy command: (留空)** ⚠️
5. 点击 **Save and Deploy**

部署成功后访问：`https://my-tvbxo.pages.dev`

### ⚠️ 部署失败？

**Authentication error [code: 10000]**：

在 Cloudflare Pages 设置中清空 "Deploy command" 字段，让Cloudflare自动部署.next目录。详见 [DEPLOYMENT.md](DEPLOYMENT.md#错误-1-authentication-error-code-10000)

---

## 开发工具

### 自动提交和推送

```bash
# 启动自动监控
./manage-auto-commit.sh start

# 停止自动监控
./manage-auto-commit.sh stop

# 查看状态
./manage-auto-commit.sh status
```

项目使用SSH密钥进行GitHub认证，文件变化会自动提交并推送。

---

## 故障排除

### TypeScript 类型错误

```bash
npx tsc --noEmit
```

### 构建失败

```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## 相关文档

- [DEPLOYMENT.md](DEPLOYMENT.md) - 详细部署指南和故障排除

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
