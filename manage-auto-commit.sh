#!/bin/bash

# 自动监控管理脚本

SCRIPT_NAME="auto-commit.sh"
LOG_FILE="/tmp/auto-commit.log"
PID_FILE="/tmp/auto-commit.pid"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查进程是否运行
is_running() {
    ps aux | grep "$SCRIPT_NAME" | grep -v grep | grep -v manage | grep -q "auto-commit"
    return $?
}

# 获取 PID
get_pid() {
    ps aux | grep "$SCRIPT_NAME" | grep -v grep | grep -v manage | awk '{print $2}' | head -1
}

# 启动服务
start() {
    if is_running; then
        echo -e "${YELLOW}⚠️  自动监控已在运行${NC}"
        echo "PID: $(get_pid)"
        return 0
    fi

    echo -e "${GREEN}🚀 启动自动监控...${NC}"
    nohup ./"$SCRIPT_NAME" > "$LOG_FILE" 2>&1 &
    sleep 2

    if is_running; then
        echo -e "${GREEN}✅ 自动监控已启动${NC}"
        echo "PID: $(get_pid)"
        echo "日志: $LOG_FILE"
    else
        echo -e "${RED}❌ 启动失败${NC}"
        return 1
    fi
}

# 停止服务
stop() {
    if ! is_running; then
        echo -e "${YELLOW}⚠️  自动监控未运行${NC}"
        return 0
    fi

    echo -e "${RED}🛑 停止自动监控...${NC}"
    pkill -f "$SCRIPT_NAME"
    sleep 2

    if is_running; then
        echo -e "${RED}❌ 停止失败，正在强制终止...${NC}"
        pkill -9 -f "$SCRIPT_NAME"
    else
        echo -e "${GREEN}✅ 自动监控已停止${NC}"
    fi
}

# 查看状态
status() {
    echo -e "${YELLOW}📊 自动监控状态${NC}"
    echo "=========================================="

    if is_running; then
        echo -e "${GREEN}✅ 运行中${NC}"
        echo "PID: $(get_pid)"
        echo "日志: $LOG_FILE"
        echo ""
        echo "最近 10 条日志:"
        echo "=========================================="
        tail -10 "$LOG_FILE"
    else
        echo -e "${RED}❌ 未运行${NC}"
        echo "使用 './manage-auto-commit.sh start' 启动"
    fi
}

# 查看日志
logs() {
    if [ ! -f "$LOG_FILE" ]; then
        echo -e "${RED}❌ 日志文件不存在${NC}"
        return 1
    fi

    echo -e "${YELLOW}📝 日志内容（最后 30 行）:${NC}"
    echo "=========================================="
    tail -30 "$LOG_FILE"
}

# 重启服务
restart() {
    stop
    sleep 1
    start
}

# 显示帮助
help() {
    echo "自动监控管理脚本"
    echo ""
    echo "用法: ./manage-auto-commit.sh [命令]"
    echo ""
    echo "命令:"
    echo "  start    启动自动监控"
    echo "  stop     停止自动监控"
    echo "  restart  重启自动监控"
    echo "  status   查看运行状态"
    echo "  logs     查看日志"
    echo "  help     显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./manage-auto-commit.sh start   # 启动"
    echo "  ./manage-auto-commit.sh status  # 查看状态"
    echo "  ./manage-auto-commit.sh logs    # 查看日志"
}

# 主逻辑
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    help|--help|-h)
        help
        ;;
    *)
        echo -e "${RED}❌ 未知命令: $1${NC}"
        echo ""
        help
        exit 1
        ;;
esac

exit 0
