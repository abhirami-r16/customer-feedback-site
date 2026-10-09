Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\Admin\.gemini\antigravity-ide\brain\39dc2cfd-31b6-4e01-8071-14e701bf4892\male_feedback_share_clean_1791523351887.png')
$img.Save('d:\feedback system\frontend\public\male-feedback-share.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
$img.Dispose()
