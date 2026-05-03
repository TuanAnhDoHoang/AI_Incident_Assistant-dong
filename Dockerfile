FROM node:22-alpine AS frontend-dev
WORKDIR /app

COPY App/package*.json ./
RUN npm ci

COPY App ./

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM maven:3.9.6-amazoncorretto-21 AS backend-builder
WORKDIR /app

COPY AI_Incident_Assistant/pom.xml ./AI_Incident_Assistant/pom.xml
COPY AI_Incident_Assistant/src ./AI_Incident_Assistant/src

RUN mvn -f AI_Incident_Assistant/pom.xml clean package -DskipTests

FROM ghcr.io/graalvm/jdk-community:21 AS backend
WORKDIR /app

COPY --from=backend-builder /app/AI_Incident_Assistant/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
