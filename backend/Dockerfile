# Verwende das offizielle Node.js LTS Image
FROM node:23-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere package.json und package-lock.json (falls vorhanden)
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den Rest des Backend-Quellcodes
COPY . .

# Exponiere den Port, auf dem das Backend lauscht (anpassen falls nötig)
EXPOSE 3000

# Starte das Backend
CMD ["node", "server.js"]
