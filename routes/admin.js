//route de la page admin

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal

router.use(express.static('public'));

router.get("/admin", function(req,res){

    if(!req.session.user || req.session.user.role!=='admin'){
       return res.redirect("/login");
    }

    res.sendFile(path.join(__dirname, "../public/html/admin.html"));
});


router.get("/admin/users", function(req,res){

    if(!req.session.user || req.session.user.role!=='admin'){
        return res.redirect("/login");
    }

    res.sendFile(path.join(__dirname, "../public/html/users.html"));
});

module.exports=router; //rendre la route accessible depuis un autre fichier