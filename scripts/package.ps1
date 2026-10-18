$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$outputRoot = Join-Path $projectRoot '_site'
# 僅覆寫明確列出的發布檔案，不清除其他資料夾。
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot 'index.html') -Destination (Join-Path $outputRoot 'index.html') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'members.html') -Destination (Join-Path $outputRoot 'members.html') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'assets') -Destination $outputRoot -Recurse -Force
Write-Output "網站發布檔案已整理至 $outputRoot"
