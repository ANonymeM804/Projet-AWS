const path = require("path");
const express = require("express");
const db = require("../database/knex");

const router = express.Router();

// Afficher la page ajouter
router.get("/ajouter", function (req, res) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    const isAdmin = req.session.user.role === "admin";
    const canCreate = req.session.user.can_create === 1 || req.session.user.can_create === true;

    // Seul l'admin ou le propriétaire du post-it avec les droits de création peuvent accéder à cette page
    if (!isAdmin && !canCreate) {
        return res.redirect("/mur_postits?error=create_denied");
    }

    return res.sendFile(path.join(__dirname, "../public/html/ajouter.html"));
});

// Ajouter un post-it
router.post("/ajouter", async function (req, res) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    const isAdmin = req.session.user.role === "admin";
    const canCreate = req.session.user.can_create === 1 || req.session.user.can_create === true;

    if (!isAdmin && !canCreate) {
        return res.redirect("/mur_postits?error=create_denied");
    }

    const { text, x, y, color } = req.body;
    const user_id = req.session.user.id;

    const posX = Number(x);
    const posY = Number(y);

    if (!text || Number.isNaN(posX) || Number.isNaN(posY)) {
        return res.status(400).json({ error: "Données invalides" });
    }

    try {
        const result = await db("postits").insert({
            text: text.trim(),
            x: posX,
            y: posY,
            color: color,
            user_id: user_id
        });

        return res.json({
            success: true,
            id: result[0]
        });
    } catch (error) {
        console.error("Erreur base de données :", error.message);
        return res.status(500).json({
            error: "Erreur base de données"
        });
    }
});

module.exports = router;