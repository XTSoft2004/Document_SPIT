param (
    [string]$Username
)

if (-not $Username) {
    $Username = Read-Host "Vui lòng nhập Docker Hub Username của bạn"
}

if (-not $Username) {
    Write-Host "Username là bắt buộc. Đang thoát..." -ForegroundColor Red
    exit 1
}

$BackendImage = "$Username/document-spit:backend"
$FrontendImage = "$Username/document-spit:frontend"

Write-Host "=== Đăng nhập vào Docker Hub ===" -ForegroundColor Cyan
docker login

Write-Host "=== Đang build Backend Image: $BackendImage ===" -ForegroundColor Cyan
Push-Location "c:\Users\XuanTruong_PC\Documents\Document_SPIT\Document_SPIT_BE"
docker build -t $BackendImage -f Dockerfile .
Pop-Location

Write-Host "=== Đang build Frontend Image: $FrontendImage ===" -ForegroundColor Cyan
Push-Location "c:\Users\XuanTruong_PC\Documents\Document_SPIT\frontend_document"
docker build -t $FrontendImage -f Dockerfile .
Pop-Location

Write-Host "=== Đang push Backend Image lên Docker Hub ===" -ForegroundColor Cyan
docker push $BackendImage

Write-Host "=== Đang push Frontend Image lên Docker Hub ===" -ForegroundColor Cyan
docker push $FrontendImage

Write-Host "=== Hoàn tất! ===" -ForegroundColor Green
