Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('d:\feedback system\frontend\public\logo.jpeg')
$cropRect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, [int]($img.Height * 0.83))
$bmp = New-Object System.Drawing.Bitmap($cropRect.Width, $cropRect.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)

$finalBmp = New-Object System.Drawing.Bitmap(1200, 630)
$gFinal = [System.Drawing.Graphics]::FromImage($finalBmp)
$gFinal.Clear([System.Drawing.Color]::White)

$targetWidth = 600
$targetHeight = [int]($bmp.Height * ($targetWidth / $bmp.Width))
$x = (1200 - $targetWidth) / 2
$y = (630 - $targetHeight - 80) / 2
$gFinal.DrawImage($bmp, $x, $y, $targetWidth, $targetHeight)

$font = New-Object System.Drawing.Font("Arial", 40, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center

$textY = $y + $targetHeight + 20
$rect = New-Object System.Drawing.RectangleF(0, $textY, 1200, 100)

$gFinal.DrawString("YOUR FEEDBACK MATTERS", $font, $brush, $rect, $sf)

$finalBmp.Save('d:\feedback system\frontend\public\male-feedback-share.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()
$gFinal.Dispose()
$finalBmp.Dispose()
$font.Dispose()
$brush.Dispose()
$sf.Dispose()
