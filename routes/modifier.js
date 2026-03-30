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
    
    // Vérifier les droits d'édition
    const isAdmin = req.session.user.role === "admin";
    const canEdit = req.session.user.can_edit === 1 || req.session.user.can_edit === true;

    // Seul l'admin ou le propriétaire du post-it avec les droits d'édition peuvent accéder à cette page
    if (!isAdmin && !canEdit) {
        return res.redirect("/mur_postits?error=edit_denied");
    }


    return res.sendFile(path.join(__dirname, "../public/html/modifier.html"));
});

// Modifier un post-it
router.post("/modifier", async function (req, res) {

    if (!req.session.user) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    const {id,text,color,modified_by}= req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({ error: "Texte invalide" });
    }

     try{
        const result = await db("postits").update({
        text: text,
        color: color,
        modified: 1,
        modified_by: modified_by,
        modified_at: db.fn.now()
        }).where({id:id});

        return res.json({ success: true, id: result[0]});
        
    } 
    catch (error) {

        console.error("Erreur base de données :", error.message);

        return res.status(500).json({
            error: "Erreur base de données"
        });
    }
});

// deplacer un post-it
router.post("/deplacement", async function (req, res) {


    const {id,x,y}= req.body;

     try{
        const [max_zindex]= await db("postits").max("zindex as max_zindex");
        const zindex = (max_zindex.max_zindex || 1000) + 1;

        const result = await db("postits").update({
        x: x,
        y: y,
        zindex : zindex
        }).where({id:id});

        return res.json({ success: true, id: result[0]});
        
    } 
    catch (error) {

        console.error("Erreur base de données :", error.message);

        return res.status(500).json({
            error: "Erreur base de données"
        });
    }
});

module.exports=router; //rendre la route accessible depuis un autre fichier