New-Item -ItemType Directory -Force -Path "public\videos"
$categories = @("bjj", "fitbox", "kick", "kids", "mma")
foreach ($cat in $categories) {
    $i = 1
    Get-ChildItem -Path $cat -File | ForEach-Object {
        $newName = "$cat-$i.mp4"
        Copy-Item -Path $_.FullName -Destination "public\videos\$newName"
        $i++
    }
}
