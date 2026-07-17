#!/bin/bash

TOKEN="0402467da62d23db170ad60fb4def3280de761f18f7924ef295dbdb6898e2244"
URL="https://status.lelab.cc.cd/api/status"

log() {
  echo "[$(date '+%H:%M:%S')] $1"
}

get_status() {
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

  log "窗口: $process - $title"

  if [ "$process_lower" = "java" ] || [ "$process_lower" = "javaw" ]; then
    log "→ 匹配: 游戏中 (进程: $process_lower)"
    echo "游戏中"
    return
  fi

  for kw in "opencode" "code" "visual studio" "webstorm" "idea" "cursor" "windsurf"; do
    if echo "$title_lower" | grep -q "$kw"; then
      log "→ 匹配: 编程中 ($kw)"
      echo "编程中"
      return
    fi
  done

  if echo "$title_lower" | grep -q "clion"; then
    log "→ 匹配: 刷题中"
    echo "刷题中"
    return
  fi

  log "→ 无匹配，不上报"
  echo ""
}

log "状态上报脚本启动"
log "Worker: $URL"
echo ""

while true; do
  status=$(get_status)
  if [ -n "$status" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"status\":\"$status\"}")
    log "上报 $status → HTTP $response"
  fi
  sleep 30
done
