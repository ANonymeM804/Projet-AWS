// route pour effacer post-it

//route pour affichage du mur des postits

const path = require("path");
const express= require("express");
const db = require("../database/knex"); 
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.get("/effacer", function(req,res){

    if (!req.session.user) {
        return res.redirect("/login");
    }
    
    return res.sendFile(path.join(__dirname, "../public/html/effacer.html"));
});

router.post("/effacer", async function(req,res){

    if(!req.session.user){
        return res.status(401).json({error:"Utilisateur non connecté"});
    }

    const {id}=req.body;
    await db("postits").where("id", id).del();
    res.json({ success: true });
    

});

module.exports=router; //rendre la route accessible depuis un autre fichier