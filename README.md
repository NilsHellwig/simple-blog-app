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