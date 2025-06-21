# 🚀 Simple Blog App (MERN-Stack)

A modern, full-stack blog application built with React and Node.js.

## 📋 Prerequisites

- Docker installed and running
- Node.js (v16 or higher)
- npm or yarn package manager

## Schritte

1. Erstelle einen Ordner `frontend` und einen Ordner `backend` im Projektverzeichnis.
2. **Frontend Setup:**

   - Install Vite and create a React app:
     ```bash
     cd frontend # Wechsle in den frontend Ordner
     npm create vite@latest . -- --template react # Erstelle eine neue Vite React App
     npm install
     npm run dev # Entwicklungsserver starten
     ```
   - Remove styles from `index.css`
   - Delete `App.css`
   - Remove `vite.svg`
   - JSX files aufräumen
   - Dateien erstellen: `Authentication.jsx`, `Header.jsx`, `NewPostForm.jsx`, `Posts.jsx`
   - Install icon dependencies:\*\*

```bash
npm install @phosphor-icons/react
npm install @phosphor-icons/unplugin vite
```

## 🔧 Backend Setup

### Database Configuration

Start MongoDB container:

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

Info: To remove containers, networks and volumes, run `docker-compose down -v`.

### Project Initialization

1. **Initialize Node.js project:**

   ```bash
   npm init -y
   ```

2. **Configure ES modules:**
   Add `"type": "module"` to your `package.json`

3. **Install dependencies:**
   ```bash
   npm install express mongoose bcryptjs jsonwebtoken cors dotenv uuid
   ```
