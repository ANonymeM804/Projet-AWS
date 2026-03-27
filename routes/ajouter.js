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

    if (!isAdmin && !canCreate) {
        return res.status(403).json({ error: "Création interdite Contacter votre administrateur" });
    }

    return res.sendFile(path.join(__dirname, "../public/html/ajouter.html"));
});

// Récupérer uniquement les post-its de l'utilisateur connecté
router.get("/mes-postits", async function (req, res) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    try {
        const postits = await db("postits")
            .join("users", "postits.user_id", "users.id")
            .select(
                "postits.id",
                "postits.text",
                "postits.x",
                "postits.y",
                "postits.color",
                "postits.created_at",
                "postits.user_id",
                "users.username"
            )
            .where("postits.user_id", req.session.user.id)
            .orderBy("postits.created_at", "asc");

        return res.json(postits);
    } catch (error) {
        console.error("Erreur récupération mes post-its :", error.message);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

// Ajouter un post-it
router.post("/ajouter", async function (req, res) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    const isAdmin = req.session.user.role === "admin";
    const canCreate = req.session.user.can_create === 1 || req.session.user.can_create === true;

    if (!isAdmin && !canCreate) {
        return res.status(403).json({ error: "Création interdite" });
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