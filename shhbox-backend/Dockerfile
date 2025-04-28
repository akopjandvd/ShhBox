FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package

FROM payara/server-full:6.2024.3-jdk21
COPY --from=build /app/target/shhbox.war $DEPLOY_DIR/
