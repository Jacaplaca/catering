@echo off
echo Switching .env file based on current branch...
setlocal enabledelayedexpansion

:: Fetching current branch name
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set branch=%%i

:: Get the branch name before the first dash
for /f "tokens=1 delims=-" %%a in ("!branch!") do set base_branch=%%a

:: Get the .env file name based on the branch name
set env_file=.env.%base_branch%

:: Check if .env file for the base branch exists
if exist "!env_file!" (
    echo Using !env_file! for branch !branch!
    copy "!env_file!" .env /Y
) else (
    echo !env_file! not found, using .env.main
    copy .env.main .env /Y
)

endlocal
