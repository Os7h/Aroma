@echo off
echo ==============================================
echo   AROMA EXPLORER - REPARACION DE EMERGENCIA
echo ==============================================

echo 1. Deteniendo procesos de Node.exe bloqueados...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo 2. Iniciando servidor en modo seguro (Localhost)...
echo.
echo    Cuando veas "Ready in...", abre:
echo    http://localhost:3000
echo.

npm run dev
pause
