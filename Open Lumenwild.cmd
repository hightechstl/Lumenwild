@echo off
setlocal
cd /d "%~dp0"

set "LUMENWILD_NODE=C:\Users\Josh\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "LUMENWILD_VITE=%~dp0node_modules\vite\bin\vite.js"

if not exist "%LUMENWILD_NODE%" (
  echo Lumenwild could not find its bundled Node.js runtime.
  echo Open README.md for the manual start instructions.
  pause
  exit /b 1
)

if not exist "%LUMENWILD_VITE%" (
  echo Lumenwild's packages are not installed.
  echo Open README.md and run the install step once.
  pause
  exit /b 1
)

start "Lumenwild local server" /min "%LUMENWILD_NODE%" "%LUMENWILD_VITE%" --host 127.0.0.1 --port 5173
timeout /t 2 /nobreak >nul
start "" "microsoft-edge:http://127.0.0.1:5173/"

echo Lumenwild is opening in Microsoft Edge.
echo Keep the minimized server window open while playing.
timeout /t 4 /nobreak >nul
endlocal
