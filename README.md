# MME: Full-Stack Blog Application

Um wichtige Konzepte von React.js und Node.js zu lernen, bauen wir eine Full-Stack Blog-Anwendung. Diese Anwendung ermöglicht es Benutzern, sich zu registrieren, anzumelden und Blog-Beiträge zu erstellen, zu bearbeiten und zu löschen.

## 📋 Vorraussetzungen für Build

- Docker installieren

## ⚡ Schnellstart

### 1. Anwendung starten

Docker starten und die Anwendung bauen:

```bash
docker-compose up --build
```

**Hinweis:** `--build` sorgt dafür, dass die Anwendung neu gebaut wird, falls es Änderungen gibt. Ohne `--build` wird die Anwendung nur gestartet.

## 🎨 Frontend-Setup

### Initiale Konfiguration

1. **Standarddateien aufräumen:**
   - Unnötige Styles aus `index.css` entfernen
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

## 🔧 Backend-Setup

### Datenbankkonfiguration

MongoDB-Container starten:

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

Hinweis: Um Container, Netzwerke und Volumes zu entfernen, `docker-compose down -v` ausführen.

### Projektinitialisierung

1. **Node.js-Projekt initialisieren:**

   ```bash
   npm init -y
   ```

2. **ES-Module konfigurieren:**
   `"type": "module"` zur `package.json` hinzufügen

3. **Abhängigkeiten installieren:**
   ```bash
   npm install express mongoose bcryptjs jsonwebtoken cors dotenv uuid
   ```
