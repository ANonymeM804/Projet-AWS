//route pour revoyer la list des post-its au format json

const express= require("express");
const db = require("../database/db"); 

const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal


router.get("/list", function(req,res){

});

module.exports=router; //rendre la route accessible depuis un autre fichier