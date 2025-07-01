# Stage 1: Verwende Node.js als Build-Environment, um die React/Vite-App zu bauen
FROM node:23-alpine AS build

# Setze das Arbeitsverzeichnis im Container auf /app
WORKDIR /app

# Kopiere package.json und package-lock.json für schnelleren Docker Cache bei Änderungen
COPY package*.json ./

# Installiere alle Node.js Abhängigkeiten laut package.json
RUN npm install

# Kopiere den gesamten Quellcode in das Arbeitsverzeichnis im Container
COPY . .

# Baue die App mit Vite (erstellt den Produktionsbuild im /dist Ordner)
RUN npm run build

# Stage 2: Verwende Nginx als schlanken Webserver, um die gebaute App auszuliefern
FROM nginx:1.27.5-alpine

# Entferne die Standard-Nginx-Webdateien im html-Ordner
RUN rm -rf /usr/share/nginx/html/*

# Kopiere das Build-Ergebnis aus der vorherigen Stage (build) in den Nginx-Webroot
COPY --from=build /app/dist /usr/share/nginx/html

# Öffne Port 80 für eingehende HTTP-Verbindungen
EXPOSE 80

# Starte Nginx im Vordergrund, damit der Container aktiv bleibt
CMD ["nginx", "-g", "daemon off;"]
