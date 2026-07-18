# 乐乐 Lab - Windows 状态上报脚本
# 用法: PowerShell 以管理员运行此脚本

$TOKEN = "0402467da62d23db170ad60fb4def3280de761f18f7924ef295dbdb6898e2244"
$URL = "https://lelab.cc.cd/api/status"
$DEVICE = "乐乐的 Windows 主机"

Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  using System.Text;
  using System.Diagnostics;
  public class WinAPI {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
  }
"@

function Get-Status {
  $hwnd = [WinAPI]::GetForegroundWindow()
  $sb = New-Object System.Text.StringBuilder 256
  [void][WinAPI]::GetWindowText($hwnd, $sb, 256)
  $title = $sb.ToString()

  $procId = 0
  [WinAPI]::GetWindowThreadProcessId($hwnd, [ref]$procId) | Out-Null
  $process = ""
  if ($procId -gt 0) {
    try { $process = (Get-Process -Id $procId -ErrorAction Stop).ProcessName } catch {}
  }

  $titleLower = $title.ToLower()
  $processLower = $process.ToLower()

  Write-Host "  前台窗口: $process - $title"

  # 列出所有进程
  $allProcs = Get-Process | Sort-Object ProcessName
  $procNames = ($allProcs | ForEach-Object { $_.ProcessName }) -join ", "
  Write-Host "  所有进程: $procNames"

  # Minecraft: java.exe / javaw.exe
  if ($processLower -eq "java" -or $processLower -eq "javaw") {
    return "游戏中"
  }

  # 三角洲行动
  if ($processLower.Contains("deltaforceclient") -or $titleLower.Contains("三角洲行动")) {
    return "游戏中"
  }

  # 检查所有进程（不只是前台窗口）
  $allProcs = Get-Process
  foreach ($p in $allProcs) {
    $pn = $p.ProcessName.ToLower()
    if ($pn -eq "java" -or $pn -eq "javaw" -or $pn.Contains("deltaforceclient")) {
      return "游戏中"
    }
  }

  # 编程中
  $kw = @("opencode", "code", "visual studio", "webstorm", "idea", "cursor", "windsurf")
  foreach ($k in $kw) {
    if ($titleLower.Contains($k) -or $processLower.Contains($k)) {
      return "编程中"
    }
  }

  # 刷题中
  if ($titleLower.Contains("clion") -or $processLower.Contains("clion")) {
    return "刷题中"
  }

  return $null
}

function Get-Battery {
  try {
    $battery = Get-WmiObject -Class Win32_Battery -ErrorAction Stop
    $pct = $battery.EstimatedChargeRemaining
    if ($pct -eq $null) { return "电源供电" }
    $status = ""
    if ($battery.BatteryStatus -eq 2) { $status = "使用电池" }
    elseif ($battery.BatteryStatus -eq 6 -or $battery.BatteryStatus -eq 3) { $status = "充电中" }
    elseif ($battery.BatteryStatus -eq 7) { $status = "已充满" }
    if ($status) { return "${pct}% $status" } else { return "${pct}%" }
  } catch {
    return "电源供电"
  }
}

Write-Host "状态上报脚本启动 (Windows)"
Write-Host "Worker: $URL"
Write-Host ""

while ($true) {
  $status = Get-Status
  $battery = Get-Battery
  $logStatus = if ($status) { $status } else { "无匹配" }
  Write-Host "$(Get-Date -Format 'HH:mm:ss') 状态: $logStatus 电量: $battery"

  if ($status -or $battery) {
    $body = @{
      status = if ($status) { $status } else { $null }
      battery = if ($battery) { $battery } else { $null }
      device = $DEVICE
    } | ConvertTo-Json -Compress

    try {
      $resp = Invoke-RestMethod -Uri $URL -Method Post -Body $body -ContentType "application/json" -Headers @{ Authorization = "Bearer $TOKEN" } -ErrorAction Stop
      Write-Host "$(Get-Date -Format 'HH:mm:ss') 上报 → HTTP 200"
    } catch {
      Write-Host "$(Get-Date -Format 'HH:mm:ss') 上报 → 失败: $_"
    }
  }

  Start-Sleep -Seconds 5
}
