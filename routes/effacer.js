// route pour effacer post-it

//route pour affichage du mur des postits

const path = require("path");
const express= require("express");
const db = require("../database/knex"); 
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));




// Route pour afficher la page de suppression des post-its
router.get("/effacer", function (req, res) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    return res.sendFile(path.join(__dirname, "../public/html/effacer.html"));
});

// Route pour supprimer un post-it
router.post("/effacer", async function (req, res) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID du post-it manquant" });
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
        const canDelete = req.session.user.can_delete === 1 || req.session.user.can_delete === true;

        if (!isAdmin && !(isOwner && canDelete)) {
            return res.status(403).json({ error: "Suppression interdite" });
        }

        await db("postits")
            .where({ id: id })
            .del();

        return res.json({ success: true });

    } catch (error) {
        console.error("Erreur suppression post-it :", error.message);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});



module.exports=router; //rendre la route accessible depuis un autre fichier