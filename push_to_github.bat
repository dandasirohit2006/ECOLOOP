@echo off
echo ===================================================
echo   EcoLoop - Push to GitHub Repository
echo   Target: https://github.com/debanjonakundu08-star/ECOLOOP
echo ===================================================
echo.
echo To push, GitHub requires authentication via a Personal Access Token (PAT).
echo If you don't have one yet:
echo   1. Open: https://github.com/settings/tokens
echo   2. Click "Generate new token (classic)"
echo   3. Check the "repo" checkbox and click Generate
echo.
set /p GITHUB_TOKEN="Paste your GitHub Personal Access Token here: "
if "%GITHUB_TOKEN%"=="" (
    echo No token entered. Aborting.
    pause
    exit /b 1
)
set GITHUB_TOKEN=%GITHUB_TOKEN:"=%
set GITHUB_TOKEN=%GITHUB_TOKEN: =%


echo.
echo Uploading EcoLoop commits and files to GitHub...
".git_bin\cmd\git.exe" push https://%GITHUB_TOKEN%@github.com/debanjonakundu08-star/ECOLOOP.git main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo   SUCCESS! Project pushed to GitHub!
    echo   Vercel will now deploy automatically at:
    echo   https://ecoloop-peach.vercel.app/
    echo ===================================================
) else (
    echo.
    echo Push encountered an error. Please verify your token and permissions.
)
pause
