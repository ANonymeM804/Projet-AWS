//route pour login

const express = require("express"); 
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../database/db"); // connexion SQLite


const router = express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal

// Afficher la page login
router.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
});

// Traiter le formulaire login
router.post("/login", function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "missing" });
    }

    const cleanUsername = username.trim();

    db.get(
        "SELECT * FROM users WHERE username = ?",
        [cleanUsername],
        async function (err, user) {
            if (err) {
                console.error("Erreur SELECT users :", err.message);
                return res.status(500).json({ error: "server_error" });
            }

            if (!user) {
                return res.status(401).json({ error: "invalid" });
            }

            try {
                const match = await bcrypt.compare(password, user.password_hash);

                if (!match) {
                    return res.status(401).json({ error: "invalid" });
                }

                // Création de la session
                req.session.user = {
                    id: user.id,
                    username: user.username
                };

                // Réponse JSON avec l'utilisateur et la redirection
                return res.json({
                    success: true,
                    user: {
                        id: user.id,
                        username: user.username
                    },
                    redirect: "/mur_postits"
                });

            } catch (compareErr) {
                console.error("Erreur bcrypt.compare :", compareErr.message);
                return res.status(500).json({ error: "server_error" });
            }
        }
    );
});


module.exports = router; //rendre la route accessible depuis un autre fichier




