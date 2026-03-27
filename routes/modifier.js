//route pour affichage du mur des postits

const path = require("path");
const express= require("express");
const db = require("../database/knex");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));


// Afficher la page modifier
router.get("/modifier", function (req, res) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    return res.sendFile(path.join(__dirname, "../public/html/modifier.html"));
});

// Modifier un post-it
router.post("/modifier", async function (req, res) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    const { id, text, color } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID du post-it manquant" });
    }

    if (!text || !text.trim()) {
        return res.status(400).json({ error: "Texte invalide" });
    }

    try {
        const postit = await db("postits")
            .where({ id: id })
            .first();

        if (!postit) {
            return res.status(404).json({ error: "Post-it introuvable" });
        }

        const isAdmin = req.session.user.role === "admin";
        const isOwner = postit.user_id === req.session.user.id;
        const canEdit = req.session.user.can_edit === 1 || req.session.user.can_edit === true;

        if (!isAdmin && !(isOwner && canEdit)) {
            return res.status(403).json({ error: "Modification interdite contactez votre administrateur" });
        }

        await db("postits")
            .where({ id: id })
            .update({
                text: text.trim(),
                color: color || postit.color
            });

        return res.json({ success: true });

    } catch (error) {
        console.error("Erreur modification post-it :", error.message);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports=router; //rendre la route accessible depuis un autre fichier