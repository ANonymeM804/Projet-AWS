//route pour ajouter post-it

const path = require("path");
const express= require("express");
const db = require("../database/knex"); 

const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.get("/ajouter", function(req,res){

    if(!req.session.user){
        return res.redirect("/login");
    }

    res.sendFile(path.join(__dirname,"../public/html/ajouter.html"));
});

// Récupérer uniquement les post-its de l'utilisateur connecté
router.get("/mes-postits", async function(req,res){

    if(!req.session.user){
        return res.status(401).json({error:"Utilisateur non connecté"});
    }

    const postits = await db("postits")
        .where("user_id", req.session.user.id)
        .orderBy("created_at","asc");

    res.json(postits);
});

router.post("/ajouter", async function(req,res){

    if (!req.session.user) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    const {text,x,y} = req.body;
    const user_id = req.session.user.id;

    if (!text || x === undefined || y === undefined) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    try{
        const result = await db("postits").insert({
            text: text,
            x: x,
            y: y,
            user_id: user_id
        });
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