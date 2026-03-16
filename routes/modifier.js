//route pour affichage du mur des postits

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.get("/modifier", function(req,res){
    
    if (!req.session.user) {
        return res.redirect("/login");
    }

    return res.sendFile(path.join(__dirname, "../public/html/modifier.html"));
});

module.exports=router; //rendre la route accessible depuis un autre fichier