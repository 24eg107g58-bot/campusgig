FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY backend/pom.xml ./pom.xml
COPY backend/src ./src

RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S campusgig && adduser -S campusgig -G campusgig
USER campusgig

COPY --from=build /app/target/campusgig-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
