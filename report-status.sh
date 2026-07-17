#!/bin/bash

TOKEN="你的TOKEN"
URL="https://status.lelab.cc.cd/api/status"

# 获取当前活动窗口的进程名和窗口标题
get_status() {
  local title process

  # macOS: 用 AppleScript 获取当前窗口标题和进程名
  local info
  info=$(osascript -e '
    tell application "System Events"
      set frontApp to first application process whose frontmost is true
      set appName to name of frontApp
      set winTitle to ""
      try
        set winTitle to name of front window of frontApp
      end try
      return appName & "|||" & winTitle
    end tell
  ' 2>/dev/null)

  process=$(echo "$info" | cut -d'|' -f1)
  title=$(echo "$info" | cut -d'|' -f3)
  title_lower=$(echo "$title" | tr '[:upper:]' '[:lower:]')
  process_lower=$(echo "$process" | tr '[:upper:]' '[:lower:]')

  # 规则匹配（优先级从上到下）

  # Minecraft: java / javaw
  if [ "$process_lower" = "java" ] || [ "$process_lower" = "javaw" ]; then
    echo "游戏中"
    return
  fi

  # 编程中
  for kw in "opencode" "code" "visual studio" "webstorm" "idea" "cursor" "windsurf"; do
    if echo "$title_lower" | grep -q "$kw"; then
      echo "编程中"
      return
    fi
  done

  # 刷题中
  if echo "$title_lower" | grep -q "clion"; then
    echo "刷题中"
    return
  fi

  echo ""
}

while true; do
  status=$(get_status)
  if [ -n "$status" ]; then
    curl -s -X POST "$URL" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"status\":\"$status\"}" > /dev/null
  fi
  sleep 30
done
