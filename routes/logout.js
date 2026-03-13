//route pour logout

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.post("/logout", function(req,res){

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de connexion" });
        }
        res.json({ success: true });
    });
});

module.exports=router; //rendre la route accessible depuis un autre fichier