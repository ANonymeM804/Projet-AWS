//route pour login


const express = require("express"); 
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../database/db"); // connexion SQLite


const router = express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal

// Afficher la page login
router.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

// Traiter le formulaire login
router.post("/login", function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect("/login?error=missing");
    }

    const cleanUsername = username.trim();

    db.get(
        "SELECT * FROM users WHERE username = ?",
        [cleanUsername],
        async function (err, user) {
            if (err) {
                console.error("Erreur SELECT users :", err.message);
                return res.status(500).send("Erreur serveur.");
            }

            if (!user) {
                return res.redirect("/login?error=invalid");
            }

            try {
                const match = await bcrypt.compare(password, user.password_hash);

                if (!match) {
                    return res.redirect("/login?error=invalid");
                }

                // Création de la session
                req.session.user = {
                    id: user.id,
                    username: user.username
                };

                return res.redirect("/mur_postits");
            } catch (compareErr) {
                console.error("Erreur bcrypt.compare :", compareErr.message);
                return res.status(500).send("Erreur lors de la vérification du mot de passe.");
            }
        }
    );
});


module.exports = router; //rendre la route accessible depuis un autre fichier




