# 部署指南

本文档提供详细的部署指导，包含两种部署方案：
- **Cloudflare Pages** - 免费托管平台，适合纯前端项目
- **自己的服务器** - 完全控制，适合需要后端服务的项目

## 🚨 快速修复：Cloudflare Pages 部署失败

如果您遇到 `Missing entry-point to Worker script or to assets directory` 错误：

### 问题原因
错误使用了 `npx wrangler deploy` 命令，这是用于部署 Cloudflare Workers 的，不适用于 Next.js 应用。

### 解决方案（2 分钟内完成）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → 选择您的项目 **my-tvbxo**
3. 点击 **Settings** 标签页
4. 找到 **Builds & deployments** 部分
5. 点击 **Edit configurations**
6. **清空或删除** "Deploy command" 字段
   - ❌ 不要填写：`npx wrangler deploy`
   - ✅ 留空即可，Cloudflare Pages 会自动部署
7. **确认** 其他配置：
   - ✅ **Build command**: `npm run build`
   - ✅ **Build output directory**: `.next`（或留空）
   - ✅ **Root directory**: (留空)
8. 点击 **Save** 保存更改
9. 触发一次新的部署（推送代码或手动触发）

### 为什么这样修复？

- Cloudflare Pages 会自动处理 Next.js 应用的部署
- 只需要执行构建命令（`npm run build`）
- 不需要额外的部署命令
- Cloudflare 会自动检测并部署 `.next` 目录

---

## 目录

- [准备工作](#准备工作)
- [方案一：Cloudflare Pages 部署](#方案一cloudflare-pages-部署)
- [方案二：自己的服务器部署](#方案二自己的服务器部署)
- [域名和 HTTPS 配置](#域名和-https-配置)
- [故障排除](#故障排除)
- [常见问题](#常见问题)

---

## 准备工作

在开始部署之前，请确保：

### 基本要求

- ✅ 已将代码推送到 GitHub
- ✅ 项目可以本地构建成功（`npm run build`）
- ✅ 已安装 Node.js 20+ 和 npm
- ✅ 有 GitHub 仓库访问权限

### 检查项目

```bash
# 1. 确认在正确的目录
cd /workspace/projects

# 2. 检查 Git 状态
git status

# 3. 检查远程仓库
git remote -v

# 4. 本地测试构建
npm run build

# 5. 本地测试运行
npm start
```

---

## 方案一：Cloudflare Pages 部署

### 概述

Cloudflare Pages 是一个免费的静态网站托管平台，提供：
- ✅ 全球 CDN 加速
- ✅ 免费 SSL 证书
- ✅ 自动部署（Git 集成）
- ✅ 无限带宽
- ✅ 自定义域名支持

**适用场景**：纯前端项目、静态网站、无需后端服务

### 详细步骤

#### 第一步：注册 Cloudflare 账号

1. 访问 Cloudflare 官网：https://dash.cloudflare.com/sign-up
2. 填写注册信息：
   - **邮箱地址**：你的常用邮箱
   - **密码**：至少 8 个字符，包含大小写字母和数字
   - **确认密码**：再次输入密码
3. 点击 "Create account"
4. 检查邮箱，验证邮箱地址
5. 登录你的 Cloudflare 账号

#### 第二步：连接 GitHub 仓库

1. 登录后，你会看到 Cloudflare 的仪表板
2. 在左侧菜单栏，找到并点击 **"Workers & Pages"**
3. 在页面顶部，点击 **"Create application"** 按钮
4. 选择 **"Pages"** 标签页
5. 点击 **"Connect to Git"** 按钮
6. 系统会跳转到 GitHub 授权页面
7. 点击 **"Authorize Cloudflare Pages"** 授权访问你的 GitHub 账号
8. 返回 Cloudflare 页面

#### 第三步：导入项目

1. 在 "Connect to Git" 页面，你会看到你的所有 GitHub 仓库
2. 使用搜索框搜索：`my-tvbxo`
3. 找到仓库 `ouhaibo1980/my-tvbxo`
4. 点击仓库右侧的 **"Begin setup"** 按钮

#### 第四步：配置构建设置

Cloudflare Pages 会尝试自动检测项目类型，但我们需要手动配置：

**基本设置：**

```
Project name: my-tvbxo
Production branch: main
Framework preset: Next.js
```

**构建设置（⚠️ 重要）：**

```
Build command: npm run build
Build output directory: .next
Root directory: (留空)
Deploy command: (留空) ⚠️ 不要填写任何内容！
```

**⚠️ 关键说明**：
- ✅ **Build command**: `npm run build` - 必须填写
- ✅ **Build output directory**: `.next` - 填写 `.next` 目录
- ❌ **Deploy command**: **必须留空** - Cloudflare Pages 会自动部署，不需要手动指定部署命令
- ❌ **不要填写** `npx wrangler deploy` 或其他部署命令

**环境变量（重要）：**

点击 "Add variable" 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_VERSION` | `20` | Node.js 版本 |
| `NPM_VERSION` | `10` | npm 版本 |

**注意**：如果你的项目使用了其他环境变量（如数据库连接、API 密钥），需要在这里添加。

#### 第五步：部署

1. 确认所有配置正确后，点击页面底部的 **"Save and Deploy"** 按钮
2. Cloudflare 会自动开始部署，你会看到部署进度：
   - 📥 克隆代码
   - 📦 安装依赖（`npm install`）
   - 🔨 构建项目（`npm run build`）
   - 🚀 部署到全球 CDN

3. 等待 2-5 分钟（取决于项目大小）
4. 部署成功后，你会看到绿色的 **"Success"** 状态

#### 第六步：访问网站

部署成功后，Cloudflare 会提供两个 URL：

1. **预览部署 URL**（用于测试）：
   - 格式：`https://deploy-preview-xxx.my-tvbxo.pages.dev`

2. **生产环境 URL**：
   - 格式：`https://my-tvbxo.pages.dev`
   - 这是你的正式网站地址

**点击生产环境 URL 访问你的网站！**

#### 第七步：绑定自定义域名（可选）

如果你有自己的域名，可以绑定到 Cloudflare Pages：

1. 在项目页面，点击 **"Custom domains"** 标签
2. 点击 **"Set up a custom domain"** 按钮
3. 输入你的域名，例如：
   - `www.yourdomain.com`
   - 或直接 `yourdomain.com`

4. 点击 **"Activate domain"**

5. **配置 DNS 记录**（两种方式）：

   **方式 A：域名在 Cloudflare 管理**
   - 前往 Cloudflare DNS 设置
   - 添加 CNAME 记录：
     ```
     名称: www
     目标: my-tvbxo.pages.dev
     代理状态: 已代理（橙色云朵图标）
     ```

   **方式 B：域名在其他服务商（如阿里云、腾讯云）**
   - 前往域名服务商的 DNS 管理页面
   - 添加 CNAME 记录：
     ```
     主机记录: www
     记录类型: CNAME
     记录值: my-tvbxo.pages.dev
     TTL: 600（或默认）
     ```

6. **配置根域名**（可选）：
   - 重复上述步骤，将根域名（不带 www）也绑定：
     ```
     主机记录: @
     记录类型: CNAME
     记录值: my-tvbxo.pages.dev
     ```

7. **等待 DNS 生效**：
   - 通常需要 5-10 分钟
   - 最多可能需要 24 小时

8. **自动 SSL 证书**：
   - Cloudflare 会自动为你的域名申请免费的 SSL 证书
   - 几分钟后，你就可以通过 HTTPS 访问网站了

#### 第八步：自动部署配置

Cloudflare Pages 支持 Git 集成的自动部署：

**触发自动部署的方式：**

1. **推送代码到 main 分支**：
   ```bash
   # 本地修改代码
   git add .
   git commit -m "更新功能"
   git push origin main

   # Cloudflare 会自动检测并重新部署
   ```

2. **创建 Pull Request**：
   ```bash
   # 创建新分支
   git checkout -b feature/new-feature

   # 修改代码
   git add .
   git commit -m "添加新功能"

   # 推送到 GitHub
   git push origin feature/new-feature
   ```

3. **在 GitHub 创建 Pull Request**：
   - Cloudflare 会为 PR 创建预览部署
   - 可以在合并前测试新功能
   - 合并后自动部署到生产环境

**配置预览部署环境：**

在项目设置中，可以为不同的环境（production、preview、development）配置不同的环境变量。

#### Cloudflare Pages 高级配置

**1. 配置文件：`wrangler.toml`**

在项目根目录创建 `wrangler.toml`：

```toml
name = "my-tvbxo"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
cwd = "."
watch_dirs = ["src"]

[build.environment]
NODE_VERSION = "20"

# 预览环境变量
[env.preview.vars]
NODE_ENV = "development"

# 生产环境变量
[env.production.vars]
NODE_ENV = "production"
```

**2. 自定义 404 页面**

在 `src/app/not-found.tsx`：

```tsx
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">页面未找到</h1>
    </div>
  );
}
```

**3. 重定向规则**

在项目根目录创建 `_redirects`：

```
# 重定向规则
/old-path /new-path 301
/about /company 302

# 通配符重定向
/blog/* https://external-blog.com/:splat 301

# SPA 路由支持
/* /index.html 200
```

#### Cloudflare Pages 故障排除

**问题 1：Missing entry-point to Worker script or to assets directory**

```bash
错误：[ERROR] Missing entry-point to Worker script or to assets directory
原因：错误使用了 wrangler deploy 命令
解决方案：
1. 进入项目设置 → Builds & deployments → Edit configurations
2. 清空 "Deploy command" 字段（不要填写任何内容）
3. 保留 "Build command" 为 npm run build
4. 保留 "Build output directory" 为 .next
5. 保存更改并重新部署
6. 或者参考文档顶部的"快速修复"部分
```

**问题 2：构建失败**

```bash
错误：Build failed
原因：依赖安装失败或构建命令错误
解决：
1. 检查 package.json 的 build 命令
2. 查看 Cloudflare Pages 的构建日志
3. 确认 Node.js 版本设置正确（NODE_VERSION=20）
4. 检查 package-lock.json 是否存在
```

**问题 3：部署成功但网站无法访问**

```bash
错误：404 Not Found
原因：输出目录配置错误
解决：
1. 检查 "Build output directory" 设置
2. Next.js 应该设置为 `.next`
3. 或留空让 Cloudflare 自动检测
4. 检查根目录设置是否正确
```

**问题 4：环境变量未生效**

```bash
错误：环境变量读取失败
原因：未配置环境变量
解决：
1. 前往项目设置 → Environment variables
2. 添加需要的环境变量
3. 区分 Production 和 Preview 环境
4. 重新部署项目
```

**问题 5：TypeScript 编译错误**

```bash
错误：TypeScript compilation failed
原因：类型错误或配置问题
解决：
1. 本地运行 npm run build 检查
2. 检查 tsconfig.json 配置
3. 修复类型错误后重新提交代码
4. 使用 // @ts-ignore 临时绕过（不推荐）
```

**问题 6：依赖安装超时**

```bash
错误：npm install timeout
原因：网络问题或依赖过大
解决：
1. 增加 Cloudflare Pages 的构建超时时间（在项目设置中）
2. 检查 package.json 的依赖版本
3. 使用 .npmrc 配置镜像源（不推荐 Cloudflare Pages）
4. 优化依赖大小，移除不必要的包
```

---

## 方案二：自己的服务器部署

### 概述

部署到自己的服务器提供完全的控制权，适合：
- ✅ 需要运行后端 API
- ✅ 需要数据库
- ✅ 需要运行 Node.js 服务
- ✅ 需要自定义服务器配置

**服务器要求**：
- 操作系统：Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- 内存：至少 1GB RAM（推荐 2GB+）
- 磁盘：至少 10GB 可用空间
- 网络：公网 IP 或可访问的内网 IP

### 详细步骤

#### 第一步：服务器环境准备

##### 1.1 更新系统

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

##### 1.2 安装 Node.js 20

**方法 A：使用 NodeSource 仓库（推荐）**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

**方法 B：使用 NVM（Node Version Manager）**

```bash
# 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载 Shell 配置
source ~/.bashrc

# 安装 Node.js 20
nvm install 20

# 设置为默认版本
nvm alias default 20

# 验证安装
node -v  # 应该显示 v20.x.x
npm -v   # 应该显示 10.x.x
```

**方法 C：从官网下载**

```bash
# 下载 Node.js 20
cd /tmp
wget https://nodejs.org/dist/v20.10.0/node-v20.10.0-linux-x64.tar.xz

# 解压
tar -xf node-v20.10.0-linux-x64.tar.xz

# 移动到系统目录
sudo mv node-v20.10.0-linux-x64 /usr/local/nodejs

# 创建符号链接
sudo ln -s /usr/local/nodejs/bin/node /usr/bin/node
sudo ln -s /usr/local/nodejs/bin/npm /usr/bin/npm

# 验证安装
node -v
npm -v
```

##### 1.3 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx

# 启动 Nginx
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx

# 验证 Nginx 运行
sudo systemctl status nginx
```

**测试 Nginx**：
在浏览器访问 `http://你的服务器IP`，应该看到 Nginx 欢迎页面。

##### 1.4 安装 Git

```bash
# Ubuntu/Debian
sudo apt install -y git

# CentOS/RHEL
sudo yum install -y git

# 配置 Git 用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 验证安装
git --version
```

##### 1.5 安装 PM2（进程管理器）

```bash
# 全局安装 PM2
sudo npm install -g pm2

# 验证安装
pm2 -v

# 配置 PM2 开机自启
pm2 startup
```

**PM2 会提示你执行一条命令，复制并执行：**

```bash
# 示例（以 root 用户为例）
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

##### 1.6 安装必要工具

```bash
# Ubuntu/Debian
sudo apt install -y curl wget vim nano unzip build-essential

# CentOS/RHEL
sudo yum install -y curl wget vim nano unzip gcc-c++ make
```

#### 第二步：克隆项目

##### 2.1 创建项目目录

```bash
# 创建 Web 根目录
sudo mkdir -p /var/www

# 设置权限
sudo chown -R $USER:$USER /var/www
```

##### 2.2 克隆 GitHub 仓库

```bash
# 进入项目目录
cd /var/www

# 克隆项目
git clone https://github.com/ouhaibo1980/my-tvbxo.git

# 进入项目目录
cd my-tvbxo

# 查看项目结构
ls -la
```

**项目结构：**
```
/var/www/my-tvbxo/
├── .coze               # 项目配置
├── .git/               # Git 仓库
├── package.json        # 依赖配置
├── next.config.ts      # Next.js 配置
├── src/                # 源代码
└── ...
```

##### 2.3 安装依赖

```bash
# 进入项目目录
cd /var/www/my-tvbxo

# 清理缓存（可选）
npm cache clean --force

# 安装依赖
npm install

# 或使用 pnpm（如果项目使用 pnpm）
npm install -g pnpm
pnpm install
```

**如果遇到权限问题：**

```bash
# 使用 sudo 安装（不推荐）
sudo npm install --unsafe-perm

# 或修复权限
sudo chown -R $USER:$(id -gn) ~/.npm
```

##### 2.4 本地测试构建

```bash
# 进入项目目录
cd /var/www/my-tvbxo

# 测试构建
npm run build

# 如果构建成功，会看到：
# ✓ Compiled successfully
```

**如果构建失败：**

```bash
# 查看错误信息
npm run build -- --verbose

# 常见问题：
# 1. 依赖未安装：重新运行 npm install
# 2. 内存不足：增加 Node.js 内存限制
#    NODE_OPTIONS=--max-old-space-size=4096 npm run build
# 3. 类型错误：运行 npx tsc --noEmit 检查
```

#### 第三步：配置 Nginx

##### 3.1 创建 Nginx 配置文件

```bash
# 创建站点配置文件
sudo nano /etc/nginx/sites-available/my-tvbxo
```

**粘贴以下配置：**

```nginx
# HTTP 配置
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 如果没有域名，使用服务器 IP
    # server_name 123.456.789.0;

    # 日志文件
    access_log /var/log/nginx/my-tvbxo-access.log;
    error_log /var/log/nginx/my-tvbxo-error.log;

    # 最大上传文件大小
    client_max_body_size 10M;

    # 反向代理到 Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态文件缓存
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}

# HTTPS 配置（配置 SSL 后使用）
# server {
#     listen 443 ssl http2;
#     server_name yourdomain.com www.yourdomain.com;
#
#     # SSL 证书路径（配置 SSL 后填写）
#     ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
#
#     # SSL 配置
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers HIGH:!aNULL:!MD5;
#     ssl_prefer_server_ciphers on;
#
#     # 其他配置同上...
# }
```

**保存并退出：**
- 按 `Ctrl + X`
- 按 `Y` 确认保存
- 按 `Enter` 确认文件名

##### 3.2 启用站点

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/my-tvbxo /etc/nginx/sites-enabled/

# 删除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试 Nginx 配置
sudo nginx -t

# 应该显示：
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**如果测试失败：**

```bash
# 查看错误信息
sudo nginx -t

# 常见问题：
# 1. 配置语法错误：检查配置文件
# 2. 端口被占用：检查 80 端口是否被其他服务占用
#    sudo netstat -tuln | grep :80
# 3. 权限问题：检查文件权限
```

##### 3.3 重启 Nginx

```bash
# 重启 Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 应该显示：
# ● nginx.service - A high performance web server
#    Loaded: loaded
#    Active: active (running)
```

#### 第四步：使用 PM2 运行项目

##### 4.1 启动项目

```bash
# 进入项目目录
cd /var/www/my-tvbxo

# 使用 PM2 启动 Next.js
pm2 start npm --name "my-tvbxo" -- start

# 查看运行状态
pm2 status

# 应该显示：
# ┌────┬──────────┬──────┬───────┬─────────┬─────────┬────────┬─────┐
# │ id │ name     │ mode │ status │ cpu     │ memory  │      │     │
# ├────┼──────────┼──────┼───────┼─────────┼─────────┼────────┼─────┤
# │ 0  │ my-tvbxo │ fork │ online │ 0%      │ 100MB   │       │     │
# └────┴──────────┴──────┴───────┴─────────┴─────────┴────────┴─────┘
```

##### 4.2 查看日志

```bash
# 查看实时日志
pm2 logs my-tvbxo

# 查看错误日志
pm2 logs my-tvbxo --err

# 清空日志
pm2 flush
```

**查看详细日志：**

```bash
# 查看特定行数
pm2 logs my-tvbxo --lines 100

# 持续监控
pm2 logs my-tvbxo --lines 0
```

##### 4.3 保存 PM2 配置

```bash
# 保存当前进程列表
pm2 save

# 设置开机自启
pm2 startup

# 执行提示的命令（示例）：
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

##### 4.4 PM2 常用命令

```bash
# 启动应用
pm2 start npm --name "my-tvbxo" -- start

# 停止应用
pm2 stop my-tvbxo

# 重启应用
pm2 restart my-tvbxo

# 删除应用
pm2 delete my-tvbxo

# 查看所有应用
pm2 list

# 查看详细信息
pm2 show my-tvbxo

# 监控应用
pm2 monit

# 重载应用（零停机）
pm2 reload my-tvbxo
```

##### 4.5 创建 PM2 配置文件（可选）

在项目根目录创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'my-tvbxo',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/my-tvbxo',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/my-tvbxo-error.log',
    out_file: '/var/log/pm2/my-tvbxo-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

**使用配置文件启动：**

```bash
# 使用配置文件启动
pm2 start ecosystem.config.js

# 重载配置
pm2 reload ecosystem.config.js
```

#### 第五步：配置防火墙

##### 5.1 配置 UFW（Ubuntu/Debian）

```bash
# 允许 SSH
sudo ufw allow 22/tcp

# 允许 HTTP
sudo ufw allow 80/tcp

# 允许 HTTPS
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status

# 应该显示：
# Status: active
#
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

##### 5.2 配置 firewalld（CentOS/RHEL）

```bash
# 启动 firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld

# 允许 HTTP
sudo firewall-cmd --permanent --add-service=http

# 允许 HTTPS
sudo firewall-cmd --permanent --add-service=https

# 重新加载配置
sudo firewall-cmd --reload

# 查看状态
sudo firewall-cmd --list-all
```

#### 第六步：配置 SSL 证书（HTTPS）

使用 Let's Encrypt 免费证书，通过 Certbot 自动配置。

##### 6.1 安装 Certbot

```bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx
```

##### 6.2 配置 SSL 证书

```bash
# 自动配置 SSL（替换成你的域名）
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 如果没有域名，使用 IP 证书（不推荐）
sudo certbot certonly --standalone -d 123.456.789.0
```

**按提示操作：**

1. 输入邮箱地址（用于证书过期提醒）
2. 同意服务条款：输入 `A`
3. 是否分享邮箱：输入 `N` 或 `Y`（可选）
4. 选择重定向方式：
   - 选项 1：重定向所有 HTTP 到 HTTPS（推荐）
   - 选项 2：不重定向

**成功后显示：**

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

##### 6.3 验证 SSL 配置

```bash
# 访问 HTTPS 网站
curl -I https://yourdomain.com

# 或在浏览器访问
# https://yourdomain.com
```

**测试 SSL 配置：**

访问：https://www.ssllabs.com/ssltest/
输入你的域名，查看 SSL 评分（应该达到 A 或 A+）

##### 6.4 配置自动续期

Certbot 会自动创建续期任务，验证配置：

```bash
# 测试自动续期
sudo certbot renew --dry-run

# 应该显示：
# Successfully received certificate.
# Certificate is saved at: /etc/letsencrypt/live/yourdomain.com/fullchain.pem

# 查看定时任务
sudo systemctl list-timers | grep certbot
```

**手动续期（如果需要）：**

```bash
# 续期所有证书
sudo certbot renew

# 续期特定证书
sudo certbot renew --cert-name yourdomain.com

# 续期后重载 Nginx
sudo systemctl reload nginx
```

#### 第七步：测试部署

##### 7.1 检查服务状态

```bash
# 检查 Nginx
sudo systemctl status nginx

# 检查 PM2
pm2 status

# 检查端口监听
sudo netstat -tuln | grep -E ':(80|443|3000)'

# 应该看到：
# tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
# tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN
# tcp        0      0 127.0.0.1:3000          0.0.0.0:*               LISTEN
```

##### 7.2 访问网站

在浏览器访问：

1. **HTTP 访问**：
   - `http://yourdomain.com`
   - `http://www.yourdomain.com`
   - 或 `http://你的服务器IP`

2. **HTTPS 访问**：
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`

3. **检查重定向**：
   - 访问 `http://yourdomain.com` 应该自动跳转到 `https://yourdomain.com`

##### 7.3 查看日志

```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/my-tvbxo-access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/my-tvbxo-error.log

# PM2 日志
pm2 logs my-tvbxo

# 系统日志
sudo journalctl -u nginx -f
```

#### 第八步：配置域名和 DNS

##### 8.1 配置 A 记录

如果域名在你的服务器上：

1. 登录域名服务商（如阿里云、腾讯云、Cloudflare）
2. 找到 DNS 管理页面
3. 添加 A 记录：

```
主机记录: @
记录类型: A
记录值: 你的服务器IP
TTL: 600（或默认）
```

##### 8.2 配置 CNAME 记录（可选）

如果想使用 `www` 子域名：

```
主机记录: www
记录类型: CNAME
记录值: yourdomain.com
TTL: 600（或默认）
```

##### 8.3 等待 DNS 生效

```bash
# 测试 DNS 解析
ping yourdomain.com

# 查询 DNS 记录
nslookup yourdomain.com

# 或使用 dig
dig yourdomain.com
```

**DNS 生效时间**：
- 通常 5-10 分钟
- 最多可能需要 24 小时

##### 8.4 配置域名在 Cloudflare（推荐）

如果想使用 Cloudflare 的 CDN 和防护：

1. 注册 Cloudflare 账号：https://dash.cloudflare.com/sign-up
2. 添加站点，输入你的域名
3. Cloudflare 会自动扫描你的 DNS 记录
4. 选择免费计划
5. 修改域名服务器为 Cloudflare 提供的服务器
6. 等待 DNS 服务器生效（通常 24 小时内）

**配置 SSL/TLS：**

在 Cloudflare 设置中：
- SSL/TLS 模式：选择 "Full" 或 "Full (strict)"
- Always Use HTTPS：开启（强制 HTTPS）

---

## 域名和 HTTPS 配置

### 购买域名

推荐的域名注册商：

1. **阿里云**：https://wanwang.aliyun.com
   - 国内访问速度快
   - 中文界面
   - 价格：约 50-100 元/年

2. **腾讯云**：https://dnspod.cloud.tencent.com
   - 国内访问速度快
   - 中文界面
   - 价格：约 50-100 元/年

3. **Namecheap**：https://www.namecheap.com
   - 价格便宜（约 10 美元/年）
   - 国际品牌
   - 支持支付宝

4. **Cloudflare Registrar**：https://www.cloudflare.com/products/registrar/
   - 批发价（成本价）
   - 免费 WHOIS 隐私保护
   - 需要 Cloudflare 账号

### 域名 DNS 配置

#### 配置记录类型

**A 记录**（域名 → IP）：

```
主机记录: @
记录类型: A
记录值: 123.456.789.0（你的服务器 IP）
TTL: 600
```

**CNAME 记录**（别名）：

```
主机记录: www
记录类型: CNAME
记录值: yourdomain.com
TTL: 600
```

**MX 记录**（邮件）：

```
主机记录: @
记录类型: MX
记录值: mail.yourdomain.com
优先级: 10
```

**TXT 记录**（验证）：

```
主机记录: @
记录类型: TXT
记录值: v=spf1 include:_spf.google.com ~all
```

#### DNS 生效时间

- 全球生效：通常 24-48 小时
- 部分地区：5-10 分钟
- 检查工具：
  - https://dnschecker.org
  - https://whatsmydns.net

### HTTPS 配置

#### SSL 证书类型

1. **Let's Encrypt**（免费）
   - 有效期：90 天（自动续期）
   - 适用：个人网站、测试项目
   - 工具：Certbot

2. **Cloudflare SSL**（免费）
   - 有效期：15 年
   - 适用：使用 Cloudflare 的网站
   - 自动管理

3. **商业 SSL**（付费）
   - 有效期：1 年
   - 适用：企业网站、电商
   - 供应商：DigiCert、Sectigo 等

#### SSL 配置检查

1. **在线测试**：
   - https://www.ssllabs.com/ssltest/
   - 评分应该达到 A 或 A+

2. **浏览器检查**：
   - 访问网站，查看地址栏的锁图标
   - 点击查看证书详情

3. **命令行检查**：

```bash
# 检查 SSL 证书
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# 或使用 curl
curl -I https://yourdomain.com
```

---

## 故障排除

### 通用问题

#### 问题 1：网站无法访问

**症状**：
- 浏览器显示 "无法访问此网站"
- 连接超时

**排查步骤**：

```bash
# 1. 检查服务是否运行
pm2 status
sudo systemctl status nginx

# 2. 检查端口是否监听
sudo netstat -tuln | grep -E ':(80|443|3000)'

# 3. 检查防火墙
sudo ufw status
# 或
sudo firewall-cmd --list-all

# 4. 检查域名解析
ping yourdomain.com
nslookup yourdomain.com

# 5. 测试本地访问
curl http://localhost:3000
curl http://your-server-ip
```

**常见原因**：
- 服务未启动 → 启动服务
- 端口被占用 → 修改端口配置
- 防火墙阻止 → 开放端口
- DNS 未生效 → 等待 DNS 解析

#### 问题 2：502 Bad Gateway

**症状**：
- Nginx 显示 "502 Bad Gateway"
- 网站无法访问

**排查步骤**：

```bash
# 1. 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/my-tvbxo-error.log

# 2. 检查 Next.js 是否运行
pm2 status

# 3. 检查 Nginx 配置
sudo nginx -t

# 4. 查看 Next.js 日志
pm2 logs my-tvbxo
```

**常见原因**：
- Next.js 进程崩溃 → 重启应用
- 端口配置错误 → 检查 proxy_pass 配置
- 内存不足 → 增加服务器内存

#### 问题 3：构建失败

**症状**：
- `npm run build` 报错
- 部署失败

**排查步骤**：

```bash
# 1. 清理缓存
npm cache clean --force
rm -rf node_modules .next

# 2. 重新安装依赖
npm install

# 3. 详细构建日志
npm run build -- --verbose

# 4. 检查类型错误
npx tsc --noEmit

# 5. 增加内存限制
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**常见原因**：
- 依赖版本冲突 → 更新或降级依赖
- 内存不足 → 增加内存或使用 SWAP
- 代码错误 → 修复 TypeScript 或 ESLint 错误

### Cloudflare Pages 问题

#### 问题 1：部署失败

**症状**：
- Cloudflare Pages 显示部署失败
- 构建日志中有错误

**排查步骤**：

1. 查看 Cloudflare Pages 的构建日志
2. 检查环境变量配置
3. 验证 Node.js 版本设置
4. 在本地测试构建

```bash
# 本地测试构建
npm run build

# 检查依赖
npm list

# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 问题 2：预览部署失败

**症状**：
- Pull Request 的预览部署失败
- 生产环境正常

**排查步骤**：

1. 检查分支名称
2. 查看预览部署日志
3. 检查环境变量是否正确
4. 验证依赖版本

#### 问题 3：自定义域名无法访问

**症状**：
- 自定义域名显示 404 或连接错误
- pages.dev 域名正常

**排查步骤**：

1. 检查 DNS 配置是否正确
2. 验证 CNAME 记录是否指向正确的 pages.dev 域名
3. 等待 DNS 生效（最多 24 小时）
4. 检查 Cloudflare DNS 设置

```bash
# 检查 DNS 解析
nslookup www.yourdomain.com
# 应该返回 my-tvbxo.pages.dev
```

### 自己服务器问题

#### 问题 1：PM2 应用崩溃

**症状**：
- PM2 显示应用状态为 "stopped" 或 "errored"
- 网站无法访问

**排查步骤**：

```bash
# 查看应用状态
pm2 status

# 查看错误日志
pm2 logs my-tvbxo --err

# 查看详细信息
pm2 show my-tvbxo

# 重启应用
pm2 restart my-tvbxo
```

**配置自动重启**：

在 `ecosystem.config.js` 中：

```javascript
{
  name: 'my-tvbxo',
  autorestart: true,
  watch: false,
  max_memory_restart: '1G',
  min_uptime: '10s',
  max_restarts: 10
}
```

#### 问题 2：Nginx 配置错误

**症状**：
- `sudo nginx -t` 显示配置错误
- Nginx 无法启动

**排查步骤**：

```bash
# 测试配置
sudo nginx -t

# 查看错误详情
sudo nginx -T | grep error

# 检查配置文件语法
sudo nginx -c /etc/nginx/nginx.conf -t

# 查看日志
sudo tail -f /var/log/nginx/error.log
```

**常见错误**：

1. **端口号被占用**：

```bash
# 查找占用 80 端口的进程
sudo lsof -i :80

# 或
sudo netstat -tuln | grep :80

# 停止占用的进程
sudo kill <PID>
```

2. **权限问题**：

```bash
# 检查 Nginx 用户
ps aux | grep nginx

# 修复权限
sudo chown -R www-data:www-data /var/www
```

3. **配置语法错误**：

```bash
# 检查配置文件
sudo nginx -t

# 常见错误：
# - 缺少分号
# - 路径错误
# - 指令拼写错误
```

#### 问题 3：SSL 证书问题

**症状**：
- HTTPS 访问失败
- 证书过期或无效

**排查步骤**：

```bash
# 检查证书有效期
sudo certbot certificates

# 查看证书路径
sudo ls -la /etc/letsencrypt/live/yourdomain.com/

# 测试续期
sudo certbot renew --dry-run

# 手动续期
sudo certbot renew

# 重载 Nginx
sudo systemctl reload nginx
```

**常见问题**：

1. **证书即将过期**：

```bash
# 自动续期
sudo certbot renew

# 检查定时任务
sudo systemctl list-timers | grep certbot
```

2. **证书配置错误**：

```bash
# 检查 Nginx 配置中的证书路径
sudo cat /etc/nginx/sites-available/my-tvbxo

# 验证证书文件存在
sudo ls -la /etc/letsencrypt/live/yourdomain.com/
```

#### 问题 4：性能问题

**症状**：
- 网站加载缓慢
- 响应时间过长

**排查步骤**：

```bash
# 检查系统资源
top
htop

# 检查磁盘使用
df -h

# 检查内存使用
free -h

# 检查网络连接
sudo netstat -tuln
```

**优化建议**：

1. **启用 Nginx 缓存**：

```nginx
# 添加到 Nginx 配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 60m;
    proxy_pass http://localhost:3000;
}
```

2. **启用 Gzip 压缩**：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

3. **启用 CDN**：
   - 使用 Cloudflare CDN
   - 配置静态资源缓存

#### 问题 5：数据库连接问题

**症状**：
- 数据库连接失败
- API 报错

**排查步骤**：

```bash
# 检查数据库服务
sudo systemctl status postgresql

# 检查连接
psql -U username -d database_name

# 查看数据库日志
sudo tail -f /var/log/postgresql/postgresql-*.log
```

---

## 常见问题

### Q1: Cloudflare Pages 和自己服务器如何选择？

**A:**

| 需求 | 推荐方案 |
|------|---------|
| 纯前端网站 | Cloudflare Pages |
| 需要后端 API | 自己的服务器 |
| 需要数据库 | 自己的服务器 |
| 快速部署 | Cloudflare Pages |
| 完全控制 | 自己的服务器 |
| 免费托管 | Cloudflare Pages |
| 高流量网站 | 自己的服务器 |

### Q2: 如何迁移从 Cloudflare Pages 到自己的服务器？

**A:**

1. 备份 Cloudflare Pages 的配置
2. 在服务器上按照 "方案二" 的步骤部署
3. 更新 DNS 记录，指向服务器 IP
4. 等待 DNS 生效
5. 测试网站访问

### Q3: 如何配置多个域名？

**A:**

在 Nginx 配置中添加多个 server 块：

```nginx
server {
    listen 80;
    server_name domain1.com www.domain1.com;
    # ... 其他配置
}

server {
    listen 80;
    server_name domain2.com www.domain2.com;
    # ... 其他配置
}
```

### Q4: 如何配置 HTTPS 和 HTTP 重定向？

**A:**

在 Nginx 配置中添加重定向：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    # ... SSL 配置和其他配置
}
```

### Q5: 如何备份网站？

**A:**

```bash
# 备份项目文件
sudo tar -czf /backup/my-tvbxo-$(date +%Y%m%d).tar.gz /var/www/my-tvbxo

# 备份数据库
pg_dump -U username database_name > /backup/database-$(date +%Y%m%d).sql

# 备份 Nginx 配置
sudo cp /etc/nginx/sites-available/my-tvbxo /backup/nginx-config-$(date +%Y%m%d)

# 备份 PM2 配置
pm2 save
cp ~/.pm2/dump.pm2 /backup/pm2-dump-$(date +%Y%mdeg)
```

**自动备份脚本：**

创建 `/backup/backup.sh`：

```bash
#!/bin/bash

BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份项目
tar -czf $BACKUP_DIR/my-tvbxo-$DATE.tar.gz /var/www/my-tvbxo

# 保留最近 7 天的备份
find $BACKUP_DIR -name "my-tvbxo-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**添加到定时任务：**

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 2 点备份
0 2 * * * /backup/backup.sh
```

### Q6: 如何更新网站？

**A:**

```bash
# 1. 进入项目目录
cd /var/www/my-tvbxo

# 2. 拉取最新代码
git pull origin main

# 3. 安装新依赖（如果有）
npm install

# 4. 重新构建
npm run build

# 5. 重启应用
pm2 restart my-tvbxo

# 6. 检查日志
pm2 logs my-tvbxo
```

**自动化更新脚本：**

创建 `/var/www/my-tvbxo/update.sh`：

```bash
#!/bin/bash

cd /var/www/my-tvbxo

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Restarting application..."
pm2 restart my-tvbxo

echo "Update completed!"
```

### Q7: 如何监控网站健康状态？

**A:**

```bash
# 1. 检查服务状态
pm2 status
sudo systemctl status nginx

# 2. 检查网站响应
curl -I http://localhost:3000

# 3. 查看日志
pm2 logs my-tvbxo --lines 50

# 4. 使用监控工具
pm2 monit
```

**使用外部监控服务**：

- UptimeRobot（免费）：https://uptimerobot.com
- Pingdom（免费套餐）：https://www.pingdom.com
- StatusCake（免费）：https://www.statuscake.com

### Q8: 如何提高网站安全性？

**A:**

1. **启用 HTTPS**：
   - 使用 Let's Encrypt 免费证书
   - 强制 HTTPS 访问

2. **配置防火墙**：
   - 只开放必要的端口（80, 443）
   - 使用 fail2ban 防止暴力破解

3. **更新系统**：
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **限制 SSH 访问**：
   - 禁用 root 登录
   - 使用密钥认证

5. **使用 Cloudflare**：
   - 启用 DDoS 防护
   - 配置 WAF 规则

6. **定期备份**：
   - 设置自动备份
   - 测试恢复流程

### Q9: 如何处理高流量？

**A:**

1. **启用 CDN**：
   - 使用 Cloudflare 或 Fastly
   - 缓存静态资源

2. **负载均衡**：
   - 使用多个服务器
   - 配置 Nginx 负载均衡

3. **优化数据库**：
   - 添加数据库索引
   - 使用连接池
   - 考虑使用 Redis 缓存

4. **压缩资源**：
   - 启用 Gzip 压缩
   - 优化图片和 CSS/JS 文件

5. **水平扩展**：
   - 使用 Docker 容器化
   - 部署到 Kubernetes

### Q10: 如何查看详细的部署日志？

**A:**

**Cloudflare Pages：**

1. 进入项目页面
2. 点击 "Deployments"
3. 选择部署记录
4. 点击 "View build log"

**自己的服务器：**

```bash
# Nginx 日志
sudo tail -f /var/log/nginx/my-tvbxo-access.log
sudo tail -f /var/log/nginx/my-tvbxo-error.log

# PM2 日志
pm2 logs my-tvbxo

# 系统日志
sudo journalctl -u nginx -f
sudo journalctl -u pm2-root -f

# Next.js 应用日志
pm2 show my-tvbxo
```

---

## 总结

### 部署对比

| 特性 | Cloudflare Pages | 自己的服务器 |
|------|------------------|-------------|
| 部署难度 | ⭐ 简单 | ⭐⭐⭐ 中等 |
| 成本 | 🆓 免费 | 💰 需要服务器费用 |
| 自动部署 | ✅ 支持 | ❌ 手动 |
| 全球 CDN | ✅ 免费提供 | ❌ 需要自己配置 |
| SSL 证书 | ✅ 自动颁发 | ✅ 免费颁发 |
| 后端支持 | ❌ 仅前端 | ✅ 完全支持 |
| 数据库 | ❌ 不支持 | ✅ 完全支持 |
| 自定义域名 | ✅ 支持 | ✅ 支持 |
| 灵活性 | ⭐⭐ 中等 | ⭐⭐⭐⭐⭐ 高 |
| 维护成本 | 🆓 低 | 💰 中等 |

### 推荐选择

- **新手/快速原型** → Cloudflare Pages
- **纯前端项目** → Cloudflare Pages
- **需要后端/数据库** → 自己的服务器
- **高流量网站** → 自己的服务器 + CDN
- **企业级应用** → 自己的服务器 + 负载均衡

### 下一步

1. 根据需求选择部署方案
2. 按照详细步骤部署
3. 配置域名和 HTTPS
4. 设置监控和备份
5. 测试网站功能

---

## 技术支持

如果遇到问题，可以：

1. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. 查看 [Nginx 文档](https://nginx.org/en/docs/)
3. 查看 [PM2 文档](https://pm2.keymetrics.io/docs/)
4. 查看 [Next.js 文档](https://nextjs.org/docs)
5. 搜索 Stack Overflow 或 GitHub Issues

---

**祝你部署成功！** 🚀
