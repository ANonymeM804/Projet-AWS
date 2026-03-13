const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../database/knex");

const router = express.Router();

// Afficher la page signup
router.get("/signup", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/html/signup.html"));
});

// Traiter le formulaire signup
router.post("/signup", async function (req, res) {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
        return res.redirect("/signup?error=missing");
    }

    const cleanUsername = username.trim();

    if (cleanUsername.length < 3) {
        return res.redirect("/signup?error=username");
    }

    if (password !== confirmPassword) {
        return res.redirect("/signup?error=password");
    }

    if (password.length < 8) {
        return res.redirect("/signup?error=shortpassword");
    }

    try {
        const existingUser = await db("users")
            .where({ username: cleanUsername })
            .first();

        if (existingUser) {
            return res.redirect("/signup?error=exists");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await db("users").insert({
            username: cleanUsername,
            password_hash: passwordHash
        });

        return res.redirect("/login?success=signup");
    } catch (error) {
        console.error("Erreur signup avec Knex :", error.message);
        return res.status(500).send("Impossible de créer le compte.");
    }
});

module.exports = router;