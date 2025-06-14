# 1. Schritt: Node-Image als Build-Umgebung
FROM node:23-alpine AS build

# Arbeitsverzeichnis im Container
WORKDIR /app

# package.json und package-lock.json kopieren (für schnelleren Cache)
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Quellcode kopieren
COPY . .

# React App mit Vite builden
RUN npm run build

# 2. Schritt: Nginx als Webserver für die gebaute App
FROM nginx:1.27.5-alpine

# Standard-Nginx-Konfiguration entfernen
RUN rm -rf /usr/share/nginx/html/*

# Gebauten Vite-Output aus dem Build-Stage kopieren
COPY --from=build /app/dist /usr/share/nginx/html

# Port 80 freigeben
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]
