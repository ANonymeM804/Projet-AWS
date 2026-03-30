//route de la page admin

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal

const db = require("../database/knex");

// Middleware pour vérifier les droits d'administration
function requireAdmin(req, res, next) {

    //console.log("ADMIN CHECK =", req.session.user);// Debug : afficher les informations de session pour vérifier les droits
   if (!req.session.user ){
       return res.redirect("/login");
   }
   // Vérifier si l'utilisateur a le rôle d'admin
   if (req.session.user.role !== 'admin') {
       return res.status(403).json({ error: "Accès refusé" });
   }
   next();
}


router.use(express.static('public'));

// Route pour afficher la page d'administration
router.get("/admin", requireAdmin, function(req,res){
    res.sendFile(path.join(__dirname, "../public/html/admin.html"));
});


// Route pour afficher la page de gestion des utilisateurs
router.get("/admin/users", requireAdmin, function(req,res){

    res.sendFile(path.join(__dirname, "../public/html/users.html"));
});


// Route pour récupérer les données des utilisateurs (pour le tableau admin)
router.get("/admin/users-data", requireAdmin, async function (req, res) {
    try {
        const users = await db("users")
            .select(
                "id",
                "username",
                "role",
                "can_create",
                "can_edit",
                "can_delete",
                "created_at"
            )
            .orderBy("id", "asc");

        return res.json(users);
    } catch (error) {
        console.error("Erreur récupération utilisateurs :", error.message);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route pour mettre à jour les droits d'un utilisateur
router.post("/admin/users/:id/rights", requireAdmin, async function (req, res) {
    const userId = req.params.id;
    const { role, can_create, can_edit, can_delete } = req.body;

    try {
        await db("users")
            .where({ id: userId })
            .update({
                role: role,
                can_create: can_create ? 1 : 0,
                can_edit: can_edit ? 1 : 0,
                can_delete: can_delete ? 1 : 0
            });

        return res.json({ success: true });
    } catch (error) {
        console.error("Erreur mise à jour droits :", error.message);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route pour supprimer un utilisateur
router.post("/admin/users/:id/delete", requireAdmin, async function (req, res) {
    const userId = req.params.id;

    
    try {
        const userToDelete = await db("users")
            .where({ id: userId })
            .first();

        if (!userToDelete) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        // Empêcher de supprimer son propre compte admin
        if (req.session.user.id === Number(userId)) {
            return res.status(400).json({ error: "Vous ne pouvez pas supprimer votre propre compte." });
        }

        // Supprimer d'abord les post-its de l'utilisateur
        await db("postits")
            .where({ user_id: userId })
            .del();

        // Puis supprimer l'utilisateur
        await db("users")
            .where({ id: userId })
            .del();

        return res.json({ success: true });
    } catch (error) {
        console.error("Erreur suppression utilisateur :", error.message);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports=router; //rendre la route accessible depuis un autre fichier