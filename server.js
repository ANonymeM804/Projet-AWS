
const express = require("express");
const session = require("express-session");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "sticko_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

// Routes
const accueil = require("./routes/accueil");
const mur_postits = require("./routes/mur_postits");
const signup = require("./routes/signup");
const login = require("./routes/login");

app.use(accueil);
app.use(mur_postits);
app.use(signup);
app.use(login);

// Serveur
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});