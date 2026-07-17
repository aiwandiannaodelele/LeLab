#!/bin/bash

TOKEN="0402467da62d23db170ad60fb4def3280de761f18f7924ef295dbdb6898e2244"
URL="https://status.lelab.cc.cd/api/status"

log() {
  echo "[$(date '+%H:%M:%S')] $1" >&2
}

get_status() {
  local titles
  local STATUS_RESULT=""
  local STATUS_WINDOW=""
  local BATTERY=""

  # macOS: 获取所有应用的所有窗口标题
  titles=$(osascript -e '
    set allTitles to ""
    tell application "System Events"
      set allProcesses to every process whose background only is false
      repeat with p in allProcesses
        try
          set winTitles to name of every window of p
          repeat with t in winTitles
            if t is not "" then
              set allTitles to allTitles & (name of p) & "|||" & t & linefeed
            end if
          end repeat
        end try
      end repeat
    end tell
    return allTitles
  ' 2>/dev/null)

  log "所有窗口:"
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    process=$(echo "$line" | cut -d'|' -f1)
    title=$(echo "$line" | cut -d'|' -f3)
    title_lower=$(echo "$title" | tr '[:upper:]' '[:lower:]')
    process_lower=$(echo "$process" | tr '[:upper:]' '[:lower:]')
    combined="$title_lower $process_lower"

    log "  $process - $title"

    if [ "$process_lower" = "java" ] || [ "$process_lower" = "javaw" ]; then
      STATUS_RESULT="游戏中"
      STATUS_WINDOW="$process - $title"
    fi

    for kw in "opencode" "code" "visual studio" "webstorm" "idea" "cursor" "windsurf"; do
      if echo "$combined" | grep -q "$kw"; then
        STATUS_RESULT="编程中"
        STATUS_WINDOW="$process - $title"
      fi
    done

    if echo "$combined" | grep -q "clion"; then
      STATUS_RESULT="刷题中"
      STATUS_WINDOW="$process - $title"
    fi
  done <<< "$titles"

  if [ -n "$STATUS_RESULT" ]; then
    log "→ 匹配: $STATUS_RESULT (来自: $STATUS_WINDOW)"
    RESULT="$STATUS_RESULT"
  else
    log "→ 无匹配"
    RESULT=""
  fi

  # 获取电量
  BATTERY=$(pmset -g batt 2>/dev/null | grep -oE '[0-9]+%' | head -1)
  [ -z "$BATTERY" ] && BATTERY=""

  echo "${RESULT}||${BATTERY}"
}

log "状态上报脚本启动"
log "Worker: $URL"
echo ""

while true; do
  status=$(get_status)
  STATUS_VAL=$(echo "$status" | cut -d'|' -f1)
  BATTERY_VAL=$(echo "$status" | cut -d'|' -f2)

  if [ -n "$STATUS_VAL" ] || [ -n "$BATTERY_VAL" ]; then
    PAYLOAD=$(cat <<EOF
{
  "status": $( [ -n "$STATUS_VAL" ] && echo "\"$STATUS_VAL\"" || echo null ),
  "battery": $( [ -n "$BATTERY_VAL" ] && echo "\"$BATTERY_VAL\"" || echo null )
}
EOF
)
    response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$PAYLOAD")
    log "上报 status=$STATUS_VAL battery=$BATTERY_VAL → HTTP $response"
  fi
  sleep 5
done
