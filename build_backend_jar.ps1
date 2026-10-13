$env:JAVA_HOME = "C:\Users\Nethritha Porandla\tools\jdk-21.0.6+7"
$env:PATH = "C:\Users\Nethritha Porandla\tools\jdk-21.0.6+7\bin;C:\Users\Nethritha Porandla\tools\apache-maven-3.9.6\bin;C:\Windows\system32;C:\Windows"

Set-Location -Path "backend"
mvn package -DskipTests
