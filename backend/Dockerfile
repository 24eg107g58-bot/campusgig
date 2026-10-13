# Multi-stage Dockerfile for CAMPUSGIG Spring Boot Backend
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Install maven and package the jar
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root application user
RUN addgroup -S campusgig && adduser -S campusgig -G campusgig
USER campusgig

# Copy packaged jar from build stage
COPY --from=build /app/target/campusgig-backend-1.0.0.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
