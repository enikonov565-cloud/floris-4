@echo off
cd /d "%~dp0"
echo Starting site...
start "" /min powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8844/index.html"
