@echo off
echo 🚀 RUNNING DEV CONTAINER...

cd ../..
docker run -it --rm -p 5000:5000 ^
    -v "%cd%:/src" ^
    --env-file Script/.env ^
    document_spit_dev
