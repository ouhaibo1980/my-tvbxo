# Next.js 项目

这是一个基于 Next.js 16 的 Web 应用项目。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **包管理**: pnpm

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
bash .cozeproj/scripts/dev_run.sh
```

应用将在 [http://localhost:5000](http://localhost:5000) 启动

### 构建生产版本

```bash
npx run build
```

## Git 配置

### 查看当前状态

```bash
git status
```

### 添加远程仓库

在 GitHub/GitLab 创建仓库后，执行：

```bash
# 方式 1: 使用 HTTPS
git remote add origin https://github.com/你的用户名/仓库名.git

# 方式 2: 使用 SSH（推荐）
git remote add origin git@github.com:你的用户名/仓库名.git
```

### 推送到远程仓库

```bash
# 首次推送
git push -u origin main

# 后续推送
git push
```

### 日常使用流程

```bash
# 1. 查看修改
git status

# 2. 添加修改的文件
git add .

# 3. 提交代码
git commit -m "描述你的修改"

# 4. 推送到远程
git push
```

## 部署

### 本地部署

```bash
# 构建生产版本
bash .cozeproj/scripts/deploy_build.sh

# 运行生产版本
bash .cozeproj/scripts/deploy_run.sh
```

### 推荐的部署平台

1. **Vercel** (推荐 Next.js 项目)
   - 连接 GitHub 仓库
   - 自动部署
   - 免费 SSL

2. **Netlify**
   - 支持多种框架
   - 自动 CI/CD

3. **Cloudflare Pages**
   - 全球 CDN 加速

## 项目结构

```
.
├── .coze               # 项目配置文件
├── .cozeproj          # 预置脚本（构建、启动）
├── src                # 源代码目录
│   └── app            # Next.js App Router 页面
├── public             # 静态资源
└── package.json       # 依赖配置
```

## 环境变量

环境变量文件 `.env.local` 已被忽略，请勿提交包含敏感信息的配置。

## 常用命令

```bash
# 安装依赖
pnpm add 包名

# 类型检查
npx tsc --noEmit

# 运行开发服务器
pnpm dev

# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

## 注意事项

- `.coze` 文件是项目启动和部署的唯一依赖，请勿随意修改
- 开发环境默认运行在 5000 端口
- 代码修改会自动触发热更新（HMR）

## 自动监控推送

### 功能说明

项目已配置自动监控推送功能，使用 `inotifywait` 实时监控文件变化，自动提交并推送到 GitHub。

### 管理命令

使用 `manage-auto-commit.sh` 管理自动监控：

```bash
# 启动自动监控
./manage-auto-commit.sh start

# 停止自动监控
./manage-auto-commit.sh stop

# 查看运行状态
./manage-auto-commit.sh status

# 查看日志
./manage-auto-commit.sh logs

# 重启自动监控
./manage-auto-commit.sh restart
```

### 工作原理

1. **实时监控**：使用 `inotifywait` 监控文件系统变化
2. **智能过滤**：自动忽略 `node_modules`、`.next`、`.git`、`downloads` 等目录
3. **防抖动**：30 秒防抖时间，避免频繁提交
4. **自动提交**：检测到变化后自动提交并推送

### 配置文件

- **主脚本**：`auto-commit.sh` - 自动监控和推送逻辑
- **管理脚本**：`manage-auto-commit.sh` - 启动/停止/状态管理
- **日志文件**：`/tmp/auto-commit.log` - 运行日志

### 自定义配置

编辑 `auto-commit.sh` 可以修改：

```bash
# Git 用户信息
GIT_NAME="Auto Commit Bot"
GIT_EMAIL="bot@auto-commit.local"

# 忽略的目录（逗号分隔）
IGNORE_DIRS="node_modules,.next,.git,downloads"

# 防抖动时间（秒）
DEBOUNCE_SECONDS=30

# 日志文件
LOG_FILE="/tmp/auto-commit.log"
```

### GitHub 仓库

- **仓库地址**：https://github.com/ouhaibo1980/my-tvbxo
- **分支**：main
- **自动推送**：已配置

### 使用场景

- ✅ 实时备份项目代码
- ✅ 自动同步数据文件
- ✅ 持续开发版本管理
- ✅ 多设备代码同步

### 注意事项

- 确保 Git Token 有 `repo` 权限
- 监控脚本在后台运行，重启系统后需要手动启动
- 大量文件变化时可能需要较长时间处理
- 建议定期检查日志确保正常运行
