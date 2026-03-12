//route pour affichage du mur des postits

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.get("/mur_postits", function(req,res){
    
    if (req.session.user) {
        return res.redirect("/ajouter");
    }
    return res.sendFile(path.join(__dirname, "../public/html/mur_postits.html"));
});

module.exports=router; //rendre la route accessible depuis un autre fichier