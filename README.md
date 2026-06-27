# MME: Full-Stack Blog Application

Um wichtige Konzepte von React.js und Node.js zu lernen, bauen wir eine Full-Stack Blog-Anwendung. Diese Anwendung ermöglicht es Benutzern, sich zu registrieren, anzumelden und Blog-Beiträge zu erstellen und zu löschen.

## 📋 Voraussetzungen

- Docker installieren

## ⚡ Schnellstart

### 1. Anwendung starten

Docker starten und die Anwendung bauen:

```bash
docker compose up --build
```

**Hinweis:** `--build` sorgt dafür, dass die Anwendung neu gebaut wird, falls es Änderungen gibt. Ohne `--build` wird die Anwendung nur gestartet.

Nach dem Start ist die Anwendung erreichbar unter:

- **Frontend:** http://localhost:8889
- **Backend API:** http://localhost:3335

### 2. Seed-Daten zurücksetzen

Falls die Datenbank zurückgesetzt werden soll (z. B. nach Änderungen an den Seed-Daten in `mongo-init/init.js`):

```bash
docker compose down -v
docker compose up --build
```

Das `-v` entfernt das Datenbank-Volume, sodass die Init-Scripts beim nächsten Start erneut ausgeführt werden.

## 🎨 Frontend-Setup

### Initiale Konfiguration

1. **Standarddateien aufräumen:**
   - Unnötige Styles aus `index.css` entfernen (Vite erstellt initial eine `index.css` und eine `App.css`)
   - `App.css` löschen
   - `react.svg` und `vite.svg` entfernen

2. **App.jsx konfigurieren:**
   - Standard-HTML-Inhalt leeren
   - Nicht verwendete JSX-Elemente und Imports entfernen
   - `index.css` einbinden

3. **Icon-Abhängigkeiten installieren:**
   ```bash
   npm install @phosphor-icons/react
   npm install @phosphor-icons/unplugin vite
   ```

### Prettier einrichten

1. **Prettier installieren:**

   ```bash
   npm install --save-dev prettier
   ```

2. **`.prettierrc` erstellen** (im `frontend/`-Verzeichnis):

   ```json
   {
     "semi": true,
     "singleQuote": false,
     "tabWidth": 2,
     "trailingComma": "es5",
     "printWidth": 100
   }
   ```

3. **Format-Script in `package.json` ergänzen:**

   ```json
   "scripts": {
     "format": "prettier --write ."
   }
   ```

4. **Code formatieren:**
   ```bash
   npm run format
   ```

## 🔧 Backend-Setup

### Datenbankkonfiguration

MongoDB-Container starten:

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

Hinweis: Um Container, Netzwerke und Volumes zu entfernen, `docker compose down -v` ausführen.

### Projektinitialisierung

1. **Node.js-Projekt initialisieren:**

   ```bash
   npm init -y
   ```

2. **ES-Module konfigurieren:**
   `"type": "module"` zur `package.json` hinzufügen

3. **Abhängigkeiten installieren:**
   ```bash
   npm install express mongoose bcryptjs jsonwebtoken cors dotenv sharp
   ```

### Prettier einrichten

1. **Prettier installieren:**

   ```bash
   npm install --save-dev prettier
   ```

2. **`.prettierrc` erstellen** (im `backend/`-Verzeichnis) mit denselben Einstellungen wie im Frontend.

3. **Format-Script in `package.json` ergänzen:**

   ```json
   "scripts": {
     "format": "prettier --write ."
   }
   ```

4. **Code formatieren:**
   ```bash
   npm run format
   ```
