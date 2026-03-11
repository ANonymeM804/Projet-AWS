//route de la page principale

const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal


router.get("/", function(req,res){
    res.send("hello, port-it");
});

module.exports=router; //rendre la route accessible depuis un autre fichier