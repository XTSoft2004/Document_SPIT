@echo off
echo 📦 Building PRODUCTION image...
cd ../..
docker build -f Document_SPIT_BE/Dockerfile -t document_spit_api .