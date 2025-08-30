@echo off
echo 🚀 Running PRODUCTION container...
cd ../..
docker run -d -p 5000:5000 document_spit_api