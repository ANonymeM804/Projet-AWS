const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../database/knex");

const router = express.Router();

// Afficher la page login
router.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
});

// Traiter le formulaire login
router.post("/login", async function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "missing" });
    }

    const cleanUsername = username.trim();

    try {
        // Rechercher l'utilisateur avec Knex
        const user = await db("users")
            .where({ username: cleanUsername })
            .first();

        if (!user) {
            return res.status(401).json({ error: "invalid" });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "invalid" });
        }

        // Création de la session
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            can_create: user.can_create,
            can_edit: user.can_edit,
            can_delete: user.can_delete
        };
        

        //lien de redirection
        let redirection="/mur_postits";

        if(user.role==='admin'){
            redirection="/admin";

        }

        // Réponse JSON
        return res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            },
            redirect: redirection
        });

    } catch (error) {
        console.error("Erreur login avec Knex :", error.message);
        return res.status(500).json({ error: "server_error" });
    }
});

module.exports = router;