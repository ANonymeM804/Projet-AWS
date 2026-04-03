//route pour affichage du mur des postits pour utilisateur guest

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.get("/guest", function(req,res){
    res.render('guest.njk', { csrfToken: req.csrfToken() });
});

module.exports=router; //rendre la route accessible depuis un autre fichier