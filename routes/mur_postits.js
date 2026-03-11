//route pour affichage du mur des postits

const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.get("/mur_postits", function(req,res){
    res.send("Ici s'affiche le mur des post-its");
});

module.exports=router; //rendre la route accessible depuis un autre fichier