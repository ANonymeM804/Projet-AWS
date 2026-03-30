//route pour revoyer la list des post-its au format json

const express= require("express");
const db = require("../database/knex"); 

const router= express.Router(); //mini serveur de route qu'on peut brancher dans le serveur principal


router.get("/liste", async function (req, res) {
    try {
        const postits = await db("postits")
            .join("users", "postits.user_id", "users.id")
            .select(
                "postits.id",
                "postits.text",
                "postits.x",
                "postits.y",
                "postits.color",
                "postits.created_at",
                "users.username",
                "postits.modified",
                "postits.modified_at",
                "postits.modified_by",
                "postits.zindex"
            )
            .orderBy("postits.created_at", "asc");

        res.json(postits);
    } catch (error) {
        console.error("Erreur liste post-its :", error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get("/User_postit_liste", async function (req, res) {

    if(!req.session.user){
        return res.status(401).json({error:"Utilisateur non connecté"});
    }

    try {
        const role=req.session.user.role;

        if(role === 'admin'){

            const postits = await db("postits")
            .join("users", "postits.user_id", "users.id") 
            .select(
                    "postits.id",
                    "postits.text",
                    "postits.x",
                    "postits.y",
                    "postits.color",
                    "postits.created_at",
                    "users.username",
                    "postits.modified",
                    "postits.modified_at",
                    "postits.modified_by",
                    "postits.zindex"
                )
            .orderBy("postits.created_at","asc");
            res.json(postits);

        }else{

            const postits = await db("postits")
            .join("users", "postits.user_id","users.id")
            .where("user_id", req.session.user.id)
            .select(
                    "postits.id",
                    "postits.text",
                    "postits.x",
                    "postits.y",
                    "postits.color",
                    "postits.created_at",
                    "users.username",
                    "postits.modified",
                    "postits.modified_at",
                    "postits.modified_by",
                    "postits.zindex"

                )
            .orderBy("postits.created_at","asc");

            res.json(postits);

        }
    } catch (error) {
        console.error("Erreur liste post-its :", error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports=router; //rendre la route accessible depuis un autre fichier