$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$backupRoot = Join-Path $projectRoot '.local-backups/deploy-2026-10-17'
# 部署採原有樹為基底，只加入明確允許的專案資料，不包含本機備份。
$remote = Get-Content (Join-Path $backupRoot 'remote-tree.json') -Raw | ConvertFrom-Json
$known = @{}
foreach ($entry in $remote.tree) { if ($entry.type -eq 'blob') { $known[$entry.path] = $entry.sha } }
$files = @('index.html','README.md','CHANGELOG.md','.gitignore') | ForEach-Object { Get-Item -LiteralPath (Join-Path $projectRoot $_) }
foreach ($folder in @('.github','assets','content','scripts','backend','docs','raw_html')) {
    $files += Get-ChildItem -LiteralPath (Join-Path $projectRoot $folder) -File -Recurse | Where-Object { $_.FullName -notmatch '__pycache__' -and $_.Name -notmatch '^\.' }
}
$payload = @()
foreach ($file in $files) {
    $relative = [IO.Path]::GetRelativePath($projectRoot,$file.FullName).Replace('\','/')
    $bytes = [IO.File]::ReadAllBytes($file.FullName)
    $header = [Text.Encoding]::UTF8.GetBytes("blob $($bytes.Length)`0")
    $combined = [byte[]]::new($header.Length + $bytes.Length)
    [Array]::Copy($header,0,$combined,0,$header.Length)
    [Array]::Copy($bytes,0,$combined,$header.Length,$bytes.Length)
    $sha = [Convert]::ToHexString([Security.Cryptography.SHA1]::HashData($combined)).ToLowerInvariant()
    if ($known[$relative] -eq $sha) { continue }
    $binary = $file.Extension -in @('.jpg','.jpeg','.png','.webp')
    $payload += @{path=$relative; mode='100644'; type='blob'; localSha=$sha; encoding=$(if($binary){'base64'}else{'utf-8'}); content=$(if($binary){[Convert]::ToBase64String($bytes)}else{[Text.Encoding]::UTF8.GetString($bytes)})}
}
$payload | ConvertTo-Json -Depth 5 -Compress | Set-Content -LiteralPath (Join-Path $backupRoot 'payload.json') -NoNewline
$payload | Select-Object path,encoding | ConvertTo-Json -Compress
