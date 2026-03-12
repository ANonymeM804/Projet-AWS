const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "app.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erreur connexion SQLite :", err.message);
    } else {
        console.log("Connecté à la base SQLite");
    }
});

module.exports = db;