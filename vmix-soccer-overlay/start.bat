@echo off
title Sistema de Overlay para vMix - Futbol
color 0b

echo ===================================================
echo   SISTEMA DE OVERLAY DEPORTIVO AUTOMATICO
echo ===================================================
echo.
:: Verificar si Node.js está instalado
where node >nul 2>nul
if %errorlevel% equ 0 goto node_installed

:node_missing
echo ===================================================
echo   ALERTA: Node.js no esta instalado en esta PC.
echo ===================================================
echo.
echo Puedo instalarlo automaticamente ahora mismo sin que entres a paginas web.
echo.
set /p "instalar_auto=Quieres instalar Node.js automaticamente en 1 click? (S/N): "
if /i "%instalar_auto%"=="S" goto run_winget
goto run_manual

:run_winget
echo.
echo [+] Instalando Node.js LTS via winget de Windows...
echo [+] Por favor espera, esto tomara menos de un minuto...
echo.
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
if %errorlevel% equ 0 goto winget_success
goto winget_fail

:winget_success
echo.
echo ===================================================
echo   ¡Node.js se instalo correctamente!
echo ===================================================
echo.
echo IMPORTANTE: Cierra esta ventana negra y vuelve a abrir
echo start.bat para que el sistema reconozca la instalacion.
echo.
pause
exit

:winget_fail
echo.
echo [!] La instalacion automatica fallo (puede requerir permisos de admin).
echo [!] Abriendo el sitio oficial de descarga manual...
timeout /t 3 >nul

:run_manual
start https://nodejs.org/
echo.
echo Por favor, instala Node.js, cierra esta ventana y vuelve a ejecutar start.bat
echo.
pause
exit

:node_installed

echo [+] Verificando e instalando dependencias (npm install)...
echo.
call npm install

echo.
echo [+] Iniciando el servidor local...
echo.
echo ---------------------------------------------------
echo  El servidor correra en segundo plano.
echo  NO CIERRES esta ventana mientras transmites.
echo ---------------------------------------------------
echo.

:: Lanzar el navegador despues de 2 segundos para dar tiempo a que levante el server
start /b cmd /c "timeout /t 2 >nul && start http://localhost:3000/control.html"

:: Iniciar el server de Node.js
npm start

pause
