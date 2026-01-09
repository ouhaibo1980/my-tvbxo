# 部署指南

## 方案一：Cloudflare Pages（推荐，免费）

### 部署步骤

#### 1. 创建Cloudflare账号和项目

1. 访问 https://dash.cloudflare.com/sign-up 注册账号
2. 登录后进入 **Workers & Pages** → **Create application**
3. 选择 **Pages** 标签 → **Connect to Git**
4. 授权GitHub访问，选择 `ouhaibo1980/my-tvbxo` 仓库
5. 点击 **Begin setup**

#### 2. 配置构建设置（⚠️ 关键）

**新版界面配置**：

| 字段 | 值 | 说明 |
|------|-----|------|
| Project name | `my-tvbxo` | 项目名称 |
| Build command | `pnpm run build` | 或 `npm run build` |
| Build output directory | `.next` | 可选，自动检测 |
| Root directory | (留空) | 不需要修改 |
| **Deploy command** | **(留空)** ⚠️ | ⚠️ **重要：必须留空** |

**⚠️ 关键说明**：
- ✅ **Build command**: `pnpm run build` - 用于构建Next.js项目
- ✅ **Build output directory**: `.next` - 构建输出目录
- ❌ **Deploy command**: **必须留空！** Cloudflare Pages会自动部署.next目录

**环境变量**（可选，但推荐）：

| 变量名 | 值 |
|--------|-----|
| `NODE_VERSION` | `20` |
| `NPM_VERSION` | `10` |

#### 3. 部署

点击 **Save and Deploy**，等待2-5分钟。

部署成功后，访问：`https://my-tvbxo.pages.dev`

---

### 🚨 常见错误和解决方案

#### 错误 1: Authentication error [code: 10000]

**错误信息**：
```
✘ [ERROR] A request to the Cloudflare API failed.
  Authentication error [code: 10000]
```

**原因**：
- API Token权限不足，或
- 使用了错误的部署命令

**解决方案**：

1. 登录 https://dash.cloudflare.com/
2. 进入 **Workers & Pages** → **my-tvbxo**
3. 点击 **Settings** → **Builds & deployments**
4. 点击 **Edit configurations**
5. **清空 "Deploy command" 字段**（非常重要！）
6. 确认以下配置：
   - Build command: `pnpm run build` 或 `npm run build`
   - Build output directory: `.next`
   - Root directory: (留空)
7. 点击 **Save**
8. 触发新部署（推送代码或手动触发）

**为什么会出现这个错误？**

Cloudflare Pages的GitHub集成会自动部署构建输出（.next目录），**不需要**使用 `wrangler pages deploy` 命令。如果填写了Deploy command，wrangler会尝试调用Cloudflare API，但你的API Token可能权限不足，导致认证失败。

---

#### 错误 2: Missing entry-point to Worker script

**错误信息**：
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

**原因**：错误使用了 `npx wrangler deploy` 命令（这是Workers命令，不是Pages命令）

**解决方案**：
- 清空 "Deploy command" 字段
- 或使用正确的Pages命令：`npx wrangler pages deploy .next`

---

#### 错误 3: wrangler: not found

**错误信息**：
```
error: wrangler: not found
```

**原因**：命令缺少 `npx` 前缀

**解决方案**：
- 使用 `npx wrangler pages deploy .next`（注意前面的 `npx`）
- 或清空Deploy command字段（推荐）

---

### 🔍 配置检查清单

部署前请确认：

- [ ] 项目已推送到GitHub仓库
- [ ] Cloudflare Pages已连接GitHub
- [ ] Build command: `pnpm run build` 或 `npm run build`
- [ ] Build output directory: `.next`
- [ ] Deploy command: **(留空)** ⚠️
- [ ] 环境变量（可选）：
  - [ ] `NODE_VERSION`: `20`
  - [ ] `NPM_VERSION`: `10`

---

## 方案二：自己的服务器部署

### 前提条件

- 服务器已安装 Node.js 20+
- 服务器已安装 pnpm
- 服务器已安装 git

### 部署步骤

1. **克隆仓库**

```bash
git clone git@github.com:ouhaibo1980/my-tvbxo.git
cd my-tvbxo
```

2. **安装依赖**

```bash
pnpm install
```

3. **构建项目**

```bash
pnpm build
```

4. **启动服务**

```bash
pnpm start
```

服务将运行在 `http://localhost:3000`

### 使用PM2管理进程（推荐）

安装PM2：

```bash
npm install -g pm2
```

启动服务：

```bash
pm2 start npm --name "my-tvbxo" -- start
```

常用命令：

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs my-tvbxo

# 重启
pm2 restart my-tvbxo

# 停止
pm2 stop my-tvbxo
```

### 使用Nginx反向代理

创建Nginx配置文件 `/etc/nginx/sites-available/my-tvbxo`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/my-tvbxo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 开发工具

### 自动提交和推送

项目使用SSH密钥进行GitHub认证，并配置了文件监控自动提交系统。

#### 使用方法

```bash
# 启动自动监控
./manage-auto-commit.sh start

# 停止自动监控
./manage-auto-commit.sh stop

# 查看状态
./manage-auto-commit.sh status
```

#### 工作原理

- 使用 `inotifywait` 监控文件变化
- 防抖动机制（5秒内多次变化只提交一次）
- 自动提交并推送到GitHub
- 排除 `node_modules`、`.next`、`.git` 等目录

---

## 故障排除

### 本地构建失败

```bash
# 清理缓存
rm -rf .next node_modules
pnpm install
pnpm build
```

### TypeScript类型错误

```bash
# 运行类型检查
npx tsc --noEmit
```

### 端口被占用

```bash
# 查找占用5000端口的进程
ss -lptn 'sport = :5000'

# 杀死进程
kill -9 <PID>
```

---

## 下一步

部署成功后，你可以：

1. 配置自定义域名
2. 设置自动部署（从GitHub）
3. 配置环境变量（如API密钥）
4. 启用预览部署（Pull Request预览）
