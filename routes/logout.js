//route pour logout

const path = require("path");
const express= require("express");
const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal
router.use(express.static('public'));

router.post("/logout", function(req,res){
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de déconnexion" });
        }
        res.clearCookie('connect.sid', { 
            path: '/',
            httpOnly: true,
            secure: false

         }); //passer { path: '/' } pour que le navigateur ne garde pas le cookie
        res.json({ success: true });
    });
});

module.exports=router; //rendre la route accessible depuis un autre fichier