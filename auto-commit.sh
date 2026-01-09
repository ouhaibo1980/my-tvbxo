#!/bin/bash

# ====================================
# 自动监控并推送 Git 仓库
# 使用 inotifywait 监控文件变化
# ====================================

# 配置 Git 用户信息
GIT_NAME="Auto Commit Bot"
GIT_EMAIL="bot@auto-commit.local"

# Git 仓库远程地址
REMOTE_URL="https://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@github.com/ouhaibo1980/my-tvbxo.git"

# 监控的目录（当前目录）
WATCH_DIR="."

# 忽略的目录（逗号分隔）
IGNORE_DIRS="node_modules,.next,.git,downloads"

# 防抖动时间（秒），避免频繁提交
DEBOUNCE_SECONDS=30

# 日志文件
LOG_FILE="/tmp/auto-commit.log"

# ====================================
# 初始化
# ====================================

# 配置 Git
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"

# 确保远程仓库配置正确
git remote set-url origin "$REMOTE_URL"

# 创建日志目录
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "自动监控脚本启动"
log "监控目录: $(pwd)"
log "忽略目录: $IGNORE_DIRS"
log "=========================================="

# ====================================
# 文件变化处理函数
# ====================================

handle_change() {
    local change_info=$1

    # 跳过被忽略的目录
    if echo "$change_info" | grep -qE "$IGNORE_DIRS"; then
        return
    fi

    log "检测到变化: $change_info"

    # 防抖动：等待 DEBOUNCE_SECONDS 秒
    log "等待 $DEBOUNCE_SECONDS 秒后提交..."
    sleep "$DEBOUNCE_SECONDS"

    # 检查是否有变化
    if git diff --quiet && git diff --cached --quiet; then
        log "没有实际变化，跳过提交"
        return
    fi

    # 添加所有文件（排除 node_modules 等）
    log "添加文件到 Git..."
    git add -A

    # 检查是否有文件被添加
    if git diff --cached --quiet; then
        log "没有需要提交的文件"
        return
    fi

    # 提交
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local commit_msg="Auto commit: $timestamp

Changes:
$(git status --short)"

    log "提交更改..."
    if git commit -m "$commit_msg"; then
        log "提交成功"

        # 推送到远程仓库
        log "推送到远程仓库..."
        if git push origin main; then
            log "✅ 推送成功！"
        else
            log "❌ 推送失败！"
        fi
    else
        log "❌ 提交失败！"
    fi
}

# ====================================
# 开始监控
# ====================================

log "开始监控文件变化..."
log "按 Ctrl+C 停止监控"

# 构建排除参数
EXCLUDE_PATTERN=""
IFS=',' read -ra DIRS <<< "$IGNORE_DIRS"
for dir in "${DIRS[@]}"; do
    EXCLUDE_PATTERN="$EXCLUDE_PATTERN --exclude '$dir'"
done

# 使用 inotifywait 监控
eval "inotifywait -m -r -e modify,create,delete,move $EXCLUDE_PATTERN $WATCH_DIR" | while read -r directory events filename; do
    # 组合完整事件信息
    local full_path="${directory}${filename}"
    handle_change "$full_path - $events"
done
