@echo off
echo 🔧 Building DEV image...
cd ../..
docker build -f Document_SPIT_BE/Dockerfile -t document_spit_dev --target dev .