//route de la page principale

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal

router.use(express.static('public'));

router.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

module.exports=router; //rendre la route accessible depuis un autre fichier