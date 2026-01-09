# Cloudflare Pages 配置指南（简化版）

## 🎯 正确的 Cloudflare Pages 配置

### 配置表

| 设置项 | 正确值 | 说明 | 错误示例 |
|--------|--------|------|----------|
| **Build command** | `npm run build` | 构建命令 | `Next.js`, `npx wrangler deploy`, `build` |
| **Build output directory** | `.next` 或留空 | 输出目录 | `dist`, `build`, `out` |
| **Root directory** | 留空 | 根目录 | 填写任何值 |
| **Deploy command** | 留空（⚠️ 必须留空） | 部署命令 | `npx wrangler deploy`, `npm run deploy` |

**注意**：Cloudflare Pages 会自动检测 Next.js 框架，不需要手动选择 Framework preset。

---

## ⚠️ 常见错误配置

### 错误 1：Build command 填写 "Next.js"

```
❌ Build command: Next.js
❌ 错误信息：/bin/sh: 1: Next.js: not found
```

**正确配置**：
```
✅ Build command: npm run build
```

### 错误 2：Deploy command 填写了内容

```
❌ Deploy command: npx wrangler deploy
❌ 错误信息：Missing entry-point to Worker script or to assets directory
❌ 错误信息：It looks like you've run a Workers-specific command in a Pages project
```

**正确配置**：
```
✅ Deploy command: (留空)
```

### 错误 3：Build output directory 错误

```
❌ Build output directory: dist
❌ 错误信息：404 Not Found
```

**正确配置**：
```
✅ Build output directory: .next
```

---

## 📋 完整配置步骤（简化版）

### 步骤 1：进入项目设置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **Workers & Pages**
3. 找到并点击您的项目 **my-tvbxo**

### 步骤 2：访问构建设置

1. 在项目页面，点击 **Settings** 标签
2. 在左侧边栏中，找到并点击 **Builds & deployments**
3. 点击右侧的 **Edit configurations** 按钮

### 步骤 3：配置构建设置

您会看到一个表单，请按照以下方式填写：

#### 必填字段

| 字段 | 输入值 | 注意事项 |
|------|--------|----------|
| **Build command** | 输入 `npm run build` | ⚠️ 必须完整输入，包括 `npm run` |
| **Build output directory** | 输入 `.next` 或留空 | ⚠️ 不要添加前导 `/` |
| **Root directory** | 留空 | ⚠️ 不要填写任何内容 |
| **Deploy command** | **留空** | ⚠️ **最重要：必须留空！** |

#### 环境变量部分（Environment variables）- 可选

点击 **Add variable** 添加以下变量：

| Variable name | Value | Environment |
|---------------|-------|-------------|
| `NODE_VERSION` | `20` | Production & Preview |
| `NPM_VERSION` | `10` | Production & Preview |

### 步骤 4：保存配置

1. 检查所有配置是否正确
2. 点击页面底部的 **Save** 按钮
3. 等待保存成功提示

### 步骤 5：触发新部署

#### 方法 A：自动部署（推荐）
- 向 GitHub 仓库推送新的提交，Cloudflare 会自动触发部署

#### 方法 B：手动触发
1. 在项目页面，点击 **Deployments** 标签
2. 点击右上角的 **Create deployment** 按钮
3. 选择分支 `main`
4. 点击 **Save and Deploy**

---

## 🎨 配置示例

### 正确配置示例

```
┌─────────────────────────────────────────────┐
│ Build command: npm run build               │
│ Build output directory: .next              │
│ Root directory: (留空)                      │
│ Deploy command: (留空) ⚠️ 必须留空！         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Environment variables:                      │
│ + NODE_VERSION = 20                         │
│ + NPM_VERSION = 10                          │
└─────────────────────────────────────────────┘
```

### 错误配置示例

```
┌─────────────────────────────────────────────┐
│ Build command: Next.js ❌                   │
│ Build output directory: dist ❌              │
│ Root directory: src ❌                      │
│ Deploy command: npx wrangler deploy ❌       │
└─────────────────────────────────────────────┘
```

---

## 🔍 验证配置是否正确

### 检查清单

部署前，请确认：

- [ ] Build command 为 `npm run build`（不是 `build` 或 `Next.js`）
- [ ] Build output directory 为 `.next` 或留空
- [ ] Root directory 留空
- [ ] Deploy command **留空**（这是最常见错误）
- [ ] 已添加 `NODE_VERSION=20` 环境变量（可选）
- [ ] 已添加 `NPM_VERSION=10` 环境变量（可选）

### 测试构建命令

在本地测试构建命令是否正确：

```bash
# 测试 1：检查构建命令
cat package.json | grep -A 5 '"scripts"'

# 应该看到：
# "scripts": {
#   "build": "next build",
#   ...
# }

# 测试 2：运行构建命令
npm run build

# 如果成功，输出如下：
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization

# 测试 3：检查输出目录
ls -la .next
```

---

## 🚨 故障排除

### 问题 1：/bin/sh: 1: Next.js: not found

**原因**：Build command 填写为 "Next.js"

**解决**：
1. 将 Build command 改为 `npm run build`
2. 不要填写 "Next.js"

### 问题 2：Missing entry-point to Worker script

**原因**：Deploy command 填写了内容

**解决**：
1. 清空 Deploy command 字段
2. 留空即可

### 问题 3：It looks like you've run a Workers-specific command

**原因**：Deploy command 填写了 `npx wrangler deploy`

**解决**：
1. 清空 Deploy command 字段
2. 留空即可

### 问题 4：404 Not Found

**原因**：Build output directory 配置错误

**解决**：
1. 将 Build output directory 改为 `.next`
2. 或留空让 Cloudflare 自动检测

### 问题 5：Build failed

**原因**：可能是依赖问题或代码错误

**解决**：
1. 在本地运行 `npm run build` 检查
2. 查看构建日志中的错误信息
3. 修复代码问题后重新提交

---

## 📞 需要帮助？

如果按照以上步骤配置后仍然失败：

1. **检查构建日志**：
   - 在 Cloudflare Dashboard 查看完整的构建日志
   - 找到具体的错误信息

2. **参考详细文档**：
   - [DEPLOYMENT.md](DEPLOYMENT.md) - 完整部署指南
   - [FIX-SUMMARY.md](FIX-SUMMARY.md) - 修复总结

3. **验证本地环境**：
   ```bash
   # 确认 Node.js 版本
   node -v  # 应该是 v20.x.x

   # 确认 npm 版本
   npm -v   # 应该是 10.x.x

   # 清理并重新构建
   rm -rf .next node_modules
   npm install
   npm run build
   ```

---

## ✅ 成功标志

配置正确后，部署日志应该显示：

```
Installing project dependencies: pnpm install --frozen-lockfile
Done in 11.6s
Executing user build command: npm run build
✓ Compiled successfully in 10.6s
✓ Generating static pages (6/6)
Success: Build command completed
Uploading to Cloudflare...
Success: Deployed!
```

部署完成后，您将能够访问：
- https://my-tvbxo.pages.dev

---

**最后更新**：2026-01-09
**适用版本**：Next.js 16, Cloudflare Pages
