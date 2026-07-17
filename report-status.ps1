<#
  乐乐 Lab - 状态上报脚本
  每30秒检测当前窗口，匹配规则后上传状态到 Worker
  配合 Cloudflare Worker 使用
#>

$token = "YOUR_TOKEN_HERE"
$apiUrl = "https://你的worker域名/api/status"

$rules = @(
  @{ name = "编程中"; matchType = "title"; keywords = @("opencode", "Code", "Visual Studio", "WebStorm", "Idea") }
  @{ name = "刷题中"; matchType = "title"; keywords = @("CLion") }
)

function Get-Status {
  Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    using System.Text;
    public class WinAPI {
      [DllImport("user32.dll")]
      public static extern IntPtr GetForegroundWindow();
      [DllImport("user32.dll")]
      public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
    }
"@

  $hwnd = [WinAPI]::GetForegroundWindow()
  $sb = New-Object System.Text.StringBuilder 256
  [void][WinAPI]::GetWindowText($hwnd, $sb, 256)
  $title = $sb.ToString().ToLower()

  $pid = (Get-Process | Where-Object { $_.MainWindowHandle -eq $hwnd }).Id
  $process = ""
  if ($pid) { $process = (Get-Process -Id $pid).ProcessName.ToLower() }

  # Minecraft: java.exe / javaw.exe
  if ($process -eq "java" -or $process -eq "javaw") {
    return "游戏中"
  }

  foreach ($rule in $rules) {
    foreach ($kw in $rule.keywords) {
      if ($title.Contains($kw.ToLower())) {
        return $rule.name
      }
    }
  }

  return $null
}

while ($true) {
  $status = Get-Status
  if ($status) {
    try {
      $body = @{ status = $status } | ConvertTo-Json
      Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -ErrorAction SilentlyContinue
    } catch {}
  }
  Start-Sleep -Seconds 30
}
