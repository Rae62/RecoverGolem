require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./database/config");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const path = require("path");

const __DIRNAME = path.resolve();

const app = express();

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173", // dev vite
        "http://localhost:4173", // vite preview
        process.env.CLIENT_URL, // optionnel
        "https://golembro-s.onrender.com", // prod
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Servir fichiers statiques React build
app.use(express.static(path.join(__DIRNAME, "/Front/dist")));

// API routes
app.use(routes);

// SPA fallback : pour toutes les autres routes, envoyer index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__DIRNAME, "Front", "dist", "index.html"));
});

// Connexion MongoDB
mongoose
  .connect(config.mongoDb.uri)
  .then(() => {
    console.log("Connexion Mongo DB OK");
  })
  .catch((err) => console.log(err));

// Lancer serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
