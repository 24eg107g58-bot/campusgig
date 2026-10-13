@echo off
title CAMPUSGIG - Spring Boot Backend (Port 8080)
echo ========================================================
echo   Starting CAMPUSGIG Backend (Spring Boot 3.3.4, Java 21)
echo   Port: http://localhost:8080
echo ========================================================
set "JAVA_HOME=C:\Users\Nethritha Porandla\tools\jdk-21.0.6+7"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0backend"
if exist target\campusgig-backend-1.0.0.jar (
    "%JAVA_HOME%\bin\java.exe" -jar target\campusgig-backend-1.0.0.jar
) else (
    echo [INFO] JAR file not found. Building now...
    set "MAVEN_HOME=C:\Users\Nethritha Porandla\tools\apache-maven-3.9.6"
    set "PATH=%MAVEN_HOME%\bin;%PATH%"
    call mvn clean package -DskipTests
    "%JAVA_HOME%\bin\java.exe" -jar target\campusgig-backend-1.0.0.jar
)
pause
