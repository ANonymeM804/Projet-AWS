//route pour ajouter post-it

const path = require("path");
const express= require("express");
const db = require("../database/db"); 

const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));



//gestion autorisation d'access 
// function peutAjoutre(req, res, next) {

//     if (!req.session.user) {
//         return res.redirect("/");
//     }

//     next(); // utilisateur autorisé
// }

router.get("/ajouter", function(req,res){
    return res.sendFile(path.join(__dirname, "../public/html/ajouter.html"));
});

router.post("/ajouter", function(req,res){

    if (!req.session.user) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    const {text,x,y,color} = req.body;
    const user_id = req.session.user.id;

    if (!text || x === undefined || y === undefined) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    db.run(
        "INSERT INTO postits (text, x, y, user_id) VALUES (?, ?, ?, ?)",
        [text, x, y,user_id],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Erreur base de données" });
            }
            return res.json({ id: this.lastID, success: true });
        }
    );
    return res.redirect("/mur_postits");
});

module.exports=router; //rendre la route accessible depuis un autre fichier