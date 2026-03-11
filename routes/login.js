//route pour login

const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.get("/login", function(req,res){
    res.send("Ici s'affiche le formulair du login");
});

module.exports=router; //rendre la route accessible depuis un autre fichier