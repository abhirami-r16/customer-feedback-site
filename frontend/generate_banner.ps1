Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('d:\feedback system\frontend\public\logo.jpeg')

$finalBmp = New-Object System.Drawing.Bitmap(1200, 630)
$gFinal = [System.Drawing.Graphics]::FromImage($finalBmp)
$gFinal.Clear([System.Drawing.Color]::White)

$targetWidth = 800
$targetHeight = [int]($img.Height * ($targetWidth / $img.Width))
$x = (1200 - $targetWidth) / 2
$y = (630 - $targetHeight) / 2

$gFinal.DrawImage($img, $x, $y, $targetWidth, $targetHeight)

$finalBmp.Save('d:\feedback system\frontend\public\whatsapp-banner.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)

$img.Dispose()
$gFinal.Dispose()
$finalBmp.Dispose()
