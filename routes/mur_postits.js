//route pour affichage du mur des postits

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));


const db = require("../database/knex");


// Route pour afficher le mur des post-its
router.get("/mur_postits", function (req, res) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    return res.sendFile(path.join(__dirname, "../public/html/mur_postits.html"));
});

// Route pour récupérer les données de l'utilisateur connecté
router.get("/session-user", function (req, res) {
    if (!req.session.user) {
        return res.json({ user: null });
    }

    return res.json({
        id: req.session.user.id,
        username: req.session.user.username,
        role: req.session.user.role,
        can_create: req.session.user.can_create,
        can_edit: req.session.user.can_edit,
        can_delete: req.session.user.can_delete
    });
});

module.exports=router; //rendre la route accessible depuis un autre fichier