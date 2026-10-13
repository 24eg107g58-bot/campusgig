@echo off
set PATH=C:\Program Files\nodejs;C:\Program Files\Git\cmd;C:\Windows\system32;C:\Windows;%PATH%
cd /d "%~dp0frontend"
npm %*
