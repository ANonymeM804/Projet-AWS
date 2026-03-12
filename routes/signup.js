//route pour signup

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../database/db");

const router = express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal

// Afficher la page signup
router.get("/signup", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "public", "signup.html"));
});

// Traiter le formulaire signup
router.post("/signup", async function (req, res) {
    const { username, password, confirmPassword } = req.body;

    // 1. Vérifications de base
    if (!username || !password || !confirmPassword) {
        return res.status(400).send("Tous les champs sont obligatoires.");
    }

    const cleanUsername = username.trim();

    if (cleanUsername.length < 3) {
        return res.status(400).send("Le nom d'utilisateur doit contenir au moins 3 caractères.");
    }

    if (password !== confirmPassword) {
        return res.status(400).send("Les mots de passe ne correspondent pas.");
    }

    if (password.length < 8) {
        return res.status(400).send("Le mot de passe doit contenir au moins 8 caractères.");
    }

    try {
        // 2. Vérifier si le username existe déjà
        db.get(
            "SELECT id FROM users WHERE username = ?",
            [cleanUsername],
            async function (err, row) {
                if (err) {
                    console.error("Erreur SELECT users :", err.message);
                    return res.status(500).send("Erreur serveur.");
                }

                if (row) {
                    return res.redirect("/signup?error=username");
                }

                try {
                    // 3. Hasher le mot de passe
                    const saltRounds = 10;
                    const passwordHash = await bcrypt.hash(password, saltRounds);

                    // 4. Insérer l'utilisateur
                    db.run(
                        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                        [cleanUsername, passwordHash],
                        function (insertErr) {
                            if (insertErr) {
                                console.error("Erreur INSERT users :", insertErr.message);
                                return res.status(500).send("ERREUR 500: Impossible de créer le compte.");
                            }

                            // 5. Réponse succès
                            return res.redirect("/login");
                        }
                    );
                } catch (hashErr) {
                    console.error("Erreur bcrypt :", hashErr.message);
                    return res.status(500).send("Erreur lors du traitement du mot de passe.");
                }
            }
        );
    } catch (error) {
        console.error("Erreur générale signup :", error.message);
        return res.status(500).send("Erreur serveur inattendue.");
    }
});

module.exports = router; //rendre la route accessible depuis un autre fichier