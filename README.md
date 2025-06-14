# 🚀 Simple Blog App (MERN-Stack)

A modern, full-stack blog application built with React and Node.js.

## 📋 Prerequisites

- Docker installed and running
- Node.js (v16 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Launch the Application

Start Docker on your system, then run:

```bash
docker-compose up --build
```

## 🎨 Frontend Setup

### Initial Configuration

1. **Clean up default files:**

   - Remove unnecessary styles from `index.css`
   - Delete `App.css`
   - Remove `react.svg` and `vite.svg`

2. **Configure App.jsx:**

   - Clear default HTML content
   - Remove unused JSX and imports
   - Link to `index.css`

3. **Install icon dependencies:**
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
   npm install express mongoose bcryptjs jsonwebtoken cors dotenv
   ```

## 🛠️ Technologies Used

- **Frontend:** React, Vite, Phosphor Icons
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT, bcryptjs
- **Containerization:** Docker

## TODO:

- min #char username and password
- database initialization example

