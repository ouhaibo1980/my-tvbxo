# SSH 配置指南

本文档记录了项目的 SSH 密钥配置和使用方法。

## SSH 密钥信息

### 密钥类型
- **算法**: ED25519
- **用途**: GitHub 自动提交
- **生成时间**: 2026-01-09

### 密钥位置

**私钥**：
```
/root/.ssh/id_ed25519
```
**重要**：不要分享私钥！

**公钥**：
```
/root/.ssh/id_ed25519.pub
```
**已添加到 GitHub SSH keys**

### 公钥内容

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIo121JH7pTihQTAgWkP+x41prA1l/Pg9UTkOM4B+eOs my-tvbxo@auto-commit.local
```

---

## GitHub SSH 配置

### 添加密钥到 GitHub

**密钥已添加**：https://github.com/settings/keys

**密钥名称**：`my-tvbxo-auto-commit`

### 测试 SSH 连接

```bash
ssh -T git@github.com
```

**成功输出**：
```
Hi ouhaibo1980! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## Git 远程仓库配置

### 当前配置

**远程地址**（SSH）：
```
git@github.com:ouhaibo1980/my-tvbxo.git
```

### 查看远程地址

```bash
git remote -v
git remote get-url origin
```

### 切换到 HTTPS（如果需要）

```bash
# 切换到 HTTPS（需要 Token）
git remote set-url origin https://github.com/ouhaibo1980/my-tvbxo.git

# 切换回 SSH（推荐）
git remote set-url origin git@github.com:ouhaibo1980/my-tvbxo.git
```

---

## 自动提交脚本配置

### 脚本文件

**主脚本**：`auto-commit.sh`  
**管理脚本**：`manage-auto-commit.sh`

### 脚本中的 SSH 配置

```bash
# Git 仓库远程地址（使用 SSH）
REMOTE_URL="git@github.com:ouhaibo1980/my-tvbxo.git"
```

### 测试自动提交

```bash
# 创建测试文件
echo "测试文件 $(date)" > test-ssh.txt

# 等待 30 秒
sleep 35

# 查看日志
tail -30 /tmp/auto-commit.log

# 清理测试文件
rm -f test-ssh.txt
```

---

## SSH 密钥管理

### 查看密钥

```bash
# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 查看私钥（仅用于调试，不要分享）
cat ~/.ssh/id_ed25519
```

### 查看密钥指纹

```bash
# 查看密钥指纹
ssh-keygen -lf ~/.ssh/id_ed25519.pub

# 查看可视化的指纹（随机图）
ssh-keygen -lv ~/.ssh/id_ed25519.pub
```

### 删除密钥

```bash
# 删除公钥
rm ~/.ssh/id_ed25519.pub

# 删除私钥
rm ~/.ssh/id_ed25519
```

### 重新生成密钥

```bash
# 生成新密钥
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519 -N ""

# 查看新公钥
cat ~/.ssh/id_ed25519.pub

# 添加到 GitHub
# 访问：https://github.com/settings/keys
# 删除旧密钥，添加新密钥
```

---

## SSH 配置文件

### SSH 配置文件位置

```bash
~/.ssh/config
```

### 创建 SSH 配置（可选）

如果需要管理多个 GitHub 账号，可以创建 SSH 配置：

```bash
# 创建配置文件
nano ~/.ssh/config
```

**配置示例**：

```ssh
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

**保存并退出**：按 `Ctrl+X`，然后 `Y`，然后 `Enter`

### 测试配置

```bash
# 测试 SSH 连接
ssh -T github.com

# 或测试到特定主机
ssh -T git@github.com
```

---

## 常见问题

### Q1: SSH 连接失败

**症状**：
```
Permission denied (publickey)
```

**解决方案**：

1. 检查密钥是否存在：
   ```bash
   ls -la ~/.ssh/id_ed25519*
   ```

2. 检查公钥是否添加到 GitHub：
   - 访问：https://github.com/settings/keys
   - 确认公钥已添加

3. 测试 SSH 连接：
   ```bash
   ssh -T git@github.com -v
   ```

4. 检查密钥权限：
   ```bash
   chmod 600 ~/.ssh/id_ed25519
   chmod 644 ~/.ssh/id_ed25519.pub
   ```

### Q2: Git 推送失败

**症状**：
```
fatal: Could not read from remote repository
```

**解决方案**：

1. 检查远程地址：
   ```bash
   git remote -v
   ```

2. 确认使用 SSH：
   ```
   git@github.com:ouhaibo1980/my-tvbxo.git
   ```

3. 如果使用 HTTPS，切换到 SSH：
   ```bash
   git remote set-url origin git@github.com:ouhaibo1980/my-tvbxo.git
   ```

4. 测试 SSH 连接：
   ```bash
   ssh -T git@github.com
   ```

### Q3: 自动提交失败

**症状**：
```
❌ 推送失败！
```

**解决方案**：

1. 查看自动提交日志：
   ```bash
   tail -50 /tmp/auto-commit.log
   ```

2. 手动测试推送：
   ```bash
   git push origin main
   ```

3. 检查 SSH 密钥：
   ```bash
   ssh -T git@github.com
   ```

4. 重启自动提交：
   ```bash
   ./manage-auto-commit.sh restart
   ```

### Q4: 如何添加密钥到其他服务

**示例：GitLab**

1. 复制公钥：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. 访问 GitLab SSH 设置：
   - https://gitlab.com/-/profile/keys

3. 添加新密钥

4. 测试连接：
   ```bash
   ssh -T git@gitlab.com
   ```

---

## 安全建议

### 1. 保护私钥

- ✅ 私钥文件权限：`600`
- ✅ 不要分享私钥
- ✅ 不要提交到 Git 仓库
- ✅ 定期更换密钥

### 2. 使用密码保护（可选）

生成带密码的密钥：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**注意**：使用密码保护后，每次推送都需要输入密码。

### 3. 限制密钥权限

在 GitHub SSH Keys 设置中，可以：
- 为不同的仓库配置不同的密钥
- 删除不需要的密钥
- 定期审查密钥列表

### 4. 使用 SSH Agent（可选）

```bash
# 启动 SSH Agent
eval "$(ssh-agent -s)"

# 添加密钥到 Agent
ssh-add ~/.ssh/id_ed25519

# 查看已添加的密钥
ssh-add -l
```

---

## 相关文档

- **部署指南**：`DEPLOYMENT.md`
- **项目文档**：`README.md`
- **自动提交**：`auto-commit.sh`

---

## 更新历史

| 日期 | 更新内容 |
|------|---------|
| 2026-01-09 | 初始化 SSH 密钥配置文档 |

---

**配置完成时间**: 2026-01-09  
**密钥状态**: ✅ 活跃  
**GitHub 认证**: ✅ 成功
