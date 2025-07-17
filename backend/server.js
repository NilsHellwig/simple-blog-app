import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import fs from "fs";
import path from "path";
import sharp from "sharp";

import { v4 as uuidv4 } from "uuid"; // Mit as für bessere Lesbarkeit,  v4 ist eine funktion zur erstellung von uuids - Das ist ein 128-Bit-Wert (also 16 Bytes), der weltweit eindeutig sein soll, ohne dass man eine zentrale Stelle braucht

import { postSchema, userSchema } from "./schema.js"

const secretKey = process.env.SECRET_KEY || "SECRET_KEY";
const frontendPort = process.env.FRONTEND_PORT || 5173;

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp";
const port = process.env.PORT || 3000;

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token missing" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: `http://localhost:${frontendPort}` }));
// ✅ process.cwd() gibt den aktuellen Arbeitsordner zurück, von dem aus Node.js gestartet wurde.
console.log(process.cwd());
app.use("/images", express.static(path.join(process.cwd(), "mongo_img")));

app.post("/register", async (req, res) => {
    const { username, password, name } = req.body;

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Die 10 ist die "Salt-Rundenanzahl" oder einfach "Kostenfaktor". 
    // Sie sagt, wie oft der Hash-Algorithmus intern wiederholt wird (also wie „streng“ der Hash-Prozess ist). 
    // Je höher die Zahl, desto länger dauert das Hashen, weil es mehr Rechenarbeit ist.
    /* 
    * Passwort + zufälliges Salz
    * Algorithmus „vermatscht“ das Ganze 10 Mal (oder mehr)
    * Heraus kommt ein sicherer Code (Hash)
    * Der Hash wird gespeichert, nicht das Passwort selbst
    * Wenn du dich später einloggst, wird das Passwort wieder gehasht und mit dem gespeicherten Hash verglichen. Stimmen beide überein, bist du authentifiziert!
    */
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword, name });
    const token = jwt.sign({ username: user.username, name: user.name }, secretKey, { expiresIn: "3h" });

    res.status(201).json({
        token,
        user: { username: user.username, name: user.name },
    });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username, name: user.name }, secretKey, { expiresIn: "3h" });

    res.json({
        token,
        user: { username: user.username, name: user.name },
    });
});

app.get("/posts", async (req, res) => {
    const posts = await Post.find().sort({ postedAt: -1 });
    res.json(posts);
});

app.post("/posts", verifyToken, async (req, res) => {
    // Route zum Erstellen eines neuen Posts, mit Middleware verifyToken zur Authentifizierung

    const { title, description, imageUrl } = req.body;
    // Extrahiere title, description und imageUrl aus dem Request-Body

    const base64Pattern = /^data:image\/(png|jpg|jpeg);base64,([A-Za-z0-9+/=]+)$/;
    // Regex, um zu prüfen, ob imageUrl ein base64-kodiertes PNG oder JPG/JPEG-Bild ist

    const match = imageUrl.match(base64Pattern);
    // Versuche, das imageUrl-Format anhand des Regex zu matchen

    if (!match) {
        // Wenn imageUrl nicht dem erwarteten Format entspricht
        return res.status(400).json({ error: "Invalid image format. Only PNG and JPG base64 images are allowed." });
        // Antworte mit Fehler 400 und Meldung zum ungültigen Bildformat
    }

    const base64Data = match[2];
    // Extrahiere nur den base64-kodierten Bildinhalt aus dem Regex-Match

    const uuid = uuidv4();
    // Erzeuge eine zufällige UUID als eindeutigen Dateinamen

    const filename = `${uuid}.png`; // Always save as .png
    // Dateiname für das Bild mit .png-Endung (unabhängig vom Originalformat)

    const imagePath = path.join(process.cwd(), "mongo_img", filename)
    /*
      Vorteile von path.join() gegenüber einfachem String-Konkatenieren:
      Korrekte Pfad-Trennung je Betriebssystem
      Auf Linux/macOS werden Pfade mit / getrennt (z.B. /mongo_img/filename.png)
      Auf Windows werden Pfade mit \ getrennt (z.B. mongo_img\filename.png)
      path.join() sorgt automatisch für den richtigen Trenner, egal auf welchem System dein Code läuft.
      Vermeidung von doppelten oder fehlenden Slashes
      Wenn du "mongo_img/" + filename machst und filename z.B. auch mit / anfängt, bekommst du mongo_img//filename mit doppeltem Slash.
      path.join() kümmert sich darum, dass der Pfad sauber zusammengebaut wird (ohne doppelte oder fehlende Trennzeichen).
    */
    // Erstelle den Pfad zum Speicherort im Container (Ordner /mongo_img)

    const imageBuffer = Buffer.from(base64Data, "base64");
    // Wandle den base64-String in einen Binär-Buffer um, der gespeichert werden kann
    await sharp(imageBuffer)
        .png()
        .toFile(imagePath);
    try {
        // Versuche, das Bild mit sharp zu konvertieren und als PNG zu speichern
        await sharp(imageBuffer)
            .png()
            .toFile(imagePath);
    } catch (err) {
        // Falls Fehler beim Speichern oder Konvertieren auftritt
        return res.status(500).json({ error: "Failed to save image." });
        // Antworte mit Fehler 500 und Fehlermeldung
    }

    await Post.create({
        // Erstelle einen neuen Post in der Datenbank mit den folgenden Feldern:
        title,             // Titel des Posts
        description,       // Beschreibung des Posts
        imageUrl: uuid,    // Speichere nur die UUID des Bildes in der DB, nicht den kompletten Pfad
        author: {
            username: req.user.username, // Nutzername des Autors aus dem verifizierten Token
            name: req.user.name,         // Name des Autors aus dem verifizierten Token
        },
        postedAt: Math.floor(Date.now() / 1000), // Aktueller Zeitstempel in Sekunden
    });

    const allPosts = await Post.find().sort({ postedAt: -1 });
    // Lade alle Posts aus der DB, sortiert nach Erstellungszeit (neueste zuerst)

    res.status(201).json(allPosts);
    // Sende Antwort mit Status 201 (Created) und alle Posts als JSON zurück
});



mongoose.connect(mongoUri).then(() => {
    app.listen(port, () => {
        console.log("Server running")
    })
}).catch((err) => {
    console.log("Error connecting to MongoDB")
})

