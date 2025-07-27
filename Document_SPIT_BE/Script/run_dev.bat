@echo off
echo 🚀 RUNNING DEV CONTAINER...

cd ..
set CURRENT_DIR=%cd%
echo Current directory: %CURRENT_DIR%
docker run -it --rm -p 5000:5000 ^
    -v "%CURRENT_DIR%:/src" ^
    --env-file "%CURRENT_DIR%\.env" ^
    document_spit_dev