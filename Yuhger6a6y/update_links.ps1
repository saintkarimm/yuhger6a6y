# PowerShell script to update album timeline links
$content = Get-Content "c:\Users\SAINTKARIM\Desktop\Yuhger6a6y\album-timeline\album-timeline.html"

# Replace Spotify links
$content = $content -replace '<a href="#" class="platform-btn">Spotify</a>', '<a href="https://open.spotify.com/artist/0yuhger6a6y" class="platform-btn" target="_blank">Spotify</a>'

# Replace Apple Music links
$content = $content -replace '<a href="#" class="platform-btn">Apple Music</a>', '<a href="https://music.apple.com/artist/yuhger6a6y/0yuhger6a6y" class="platform-btn" target="_blank">Apple Music</a>'

# Replace YouTube links
$content = $content -replace '<a href="#" class="platform-btn">YouTube</a>', '<a href="https://youtube.com/@yuhger6a6y" class="platform-btn" target="_blank">YouTube</a>'

# Replace AudioMac links
$content = $content -replace '<a href="#" class="platform-btn">AudioMac</a>', '<a href="https://audiomack.com/yuhger6a6y" class="platform-btn" target="_blank">AudioMack</a>'

# Save the updated content
$content | Set-Content "c:\Users\SAINTKARIM\Desktop\Yuhger6a6y\album-timeline\album-timeline.html"

Write-Host "Album timeline links updated successfully!"