FROM node:20-alpine AS frontend-build
WORKDIR /app/ecommerce-ui

COPY ecommerce-ui/package.json ecommerce-ui/package-lock.json ./
RUN npm ci

COPY ecommerce-ui/ ./
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-17 AS backend-build
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw mvnw
COPY pom.xml pom.xml
RUN chmod +x mvnw

COPY src/ src/
COPY --from=frontend-build /app/ecommerce-ui/build/ src/main/resources/static/

RUN ./mvnw -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=backend-build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar app.jar"]
